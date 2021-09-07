import sinon from "sinon";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import CalendarRouter from "./calendar.router";

let app: express.Application = express();
app.use(express.json());
new CalendarRouter(app).configureRoutes();
const CALENDAR_ID = "2";

describe("CalendarRoutes", () => {
    beforeEach(() => {});

    afterEach(() => {
        sinon.restore();
    });

    describe("GET /calendars", () => {
        it("should return all calendars with statusCode 200", async () => {
            const response = await request(app).get("/calendars");

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved calendars"
            );
            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.be.greaterThan(0);
            expect(response.body.data[0])
                .to.be.an("object")
                .and.include.keys("calendar_id", "name");
        });
    });

    describe("POST /calendars", () => {
        it("should return error with status 400 when name is not a string", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/calendars")
                .send({ name: VALUE });

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                "Invalid Value for param: name value: 123"
            );
        });

        it("should create calendar with status 201", async () => {
            const response = await request(app)
                .post("/calendars")
                .send({ name: "Test Calendar 123" });

            expect(response.statusCode).to.equal(201);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully created calendar"
            );
            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.equal(0);
        });
    });

    describe("GET /calendars/:calendar_id", () => {
        it("should send 404 when calendar_id does not exist", async () => {
            const response = await request(app).get("/calendars/9999");

            expect(response.statusCode).to.equal(404);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `No calendar found with id: 9999`
            );
        });

        it("should retrieve calendar and send status 200", async () => {
            const response = await request(app).get("/calendars/83");

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved calendar"
            );
            expect(response.body.data)
                .to.be.an("object")
                .and.include.keys("calendar_id", "name");
        });
    });

    describe("DELETE /calendars/:calendar_id", () => {
        it("should delete calendar with status 200", async () => {
            const response = await request(app).delete("/calendars/83");

            expect(response.statusCode).to.equal(200);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully removed calendar"
            );
            expect(response.body.data).to.deep.equal([]);
        });
    });

    describe("PUT /calendars/:calendar_id", () => {
        it("should send error with status 400 if name is not string", async () => {
            const VALUE = 123;
            const response = await request(app)
                .put(`/calendars/${CALENDAR_ID}`)
                .send({ name: VALUE });

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                "Invalid Value for param: name value: 123"
            );
        });

        it("should update calendar and send status 200", async () => {
            const response = await request(app)
                .put(`/calendars/${CALENDAR_ID}`)
                .send({ name: "Caleb" });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated calendar id: ${CALENDAR_ID}`
            );
            expect(response.body.data)
                .to.be.an("object")
                .and.include.keys("calendar_id", "name");
        });
    });

    describe("PATCH /calendars/:calendar_id", () => {
        it("should send error with status 400 if name is not string", async () => {
            const VALUE = 123;
            const response = await request(app)
                .patch(`/calendars/${CALENDAR_ID}`)
                .send({ name: VALUE });

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                "Invalid Value for param: name value: 123"
            );
        });

        it("should update calendar and send status 200", async () => {
            const response = await request(app)
                .patch(`/calendars/${CALENDAR_ID}`)
                .send({ name: "Caleb" });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated calendar id: ${CALENDAR_ID}`
            );
            expect(response.body.data)
                .to.be.an("object")
                .and.include.keys("calendar_id", "name");
        });
    });

    describe("GET /calendars/:calendar_id/events", () => {
        it("should return error when calendar_id does not exist", async () => {
            const response = await request(app).get("/calendars/9999/events");

            expect(response.statusCode).to.equal(404);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `No calendar found with id: 9999`
            );
        });
    });
});
