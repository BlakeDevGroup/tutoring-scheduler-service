import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import request from "supertest";
import express from "express";
import EventRouter from "./event.router";

// import app from "../../../app";
type Payload = {
    date_end: string;
    date_start: string;
    title: string;
    all_day: Boolean;
    user_id: number;
};
let PAYLOAD: Payload;
let app: express.Application;
app = express();
app.use(express.json());
app.use("/", new EventRouter().configureRouter());
describe("EventRouter", () => {
    beforeEach(() => {
        PAYLOAD = {
            date_end: "2021-07-29T15:30",
            date_start: "2021-07-29T11:30",
            title: "MyEvent",
            all_day: true,
            user_id: 1,
        };
    });
    afterEach(() => {
        sinon.restore();
    });
    describe("GET /events", () => {
        it("should send all events of calendar_id", async () => {
            const response = await request(app)
                .get("/events")
                .send({ calendarId: 1 });

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("array");
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.be.an("object");
            expect(response.body[0]).to.have.own.property("date_end");
            expect(response.body[0]).to.have.own.property("date_start");
            expect(response.body[0]).to.have.own.property("event_id");
            expect(response.body[0]).to.have.own.property("title");
            expect(response.body[0]).to.have.own.property("all_day");
            expect(response.body[0]).to.have.own.property("user_id");
            expect(response.body[0]).to.have.own.property("calendar_id");
        });

        it("should send an empty array when there are no events on calendar_id", async () => {
            const response = await request(app)
                .get("/events")
                .send({ calendarId: 99999 });

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("array");
            expect(response.body.length).to.equal(0);
        });
    });

    describe("GET /events/:id", () => {
        it("should send event when event_id exists on calendar_id", async () => {
            const response = await request(app)
                .get("/events/1")
                .send({ calendarId: 1 });

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.own.property("date_end");
            expect(response.body).to.have.own.property("date_start");
            expect(response.body).to.have.own.property("event_id");
            expect(response.body).to.have.own.property("title");
            expect(response.body).to.have.own.property("all_day");
            expect(response.body).to.have.own.property("user_id");
            expect(response.body).to.have.own.property("calendar_id");
        });

        it("should send error when event_id does not exist on calendar_id", async () => {
            const EVENT_ID = 9999;
            const response = await request(app)
                .get(`/events/${EVENT_ID}`)
                .send({ calendarId: 1 });

            expect(response.statusCode).to.equal(404);
            expect(response.body).to.be.an("object");
            expect(response.body).to.have.own.property("error");
            expect(response.body.error).to.equal(`Event ${EVENT_ID} not found`);
        });
    });

    describe("POST /events", () => {
        it("should throw error when date_start is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        date_start: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("array");
            expect(response.body.error[0]).to.deep.equal({
                location: "body",
                msg: "Invalid value",
                param: "date_start",
                value: VALUE,
            });
        });

        it("should throw error when date_end is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        date_end: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("array");
            expect(response.body.error[0]).to.deep.equal({
                location: "body",
                msg: "Invalid value",
                param: "date_end",
                value: VALUE,
            });
        });

        it("should throw error when date_end is a date before date_start", async () => {
            const VALUE = "2021-07-28T15:30";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        date_end: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("string");
            expect(response.body.error).to.equal(
                `date_end (${VALUE}) occurs before date_start (${PAYLOAD.date_start})`
            );
        });

        it("should throw error when title is not a string", async () => {
            const VALUE = 123;

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        title: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("array");
            expect(response.body.error[0]).to.deep.equal({
                location: "body",
                msg: "Invalid value",
                param: "title",
                value: VALUE,
            });
        });

        it("should throw error when all_day is not a boolean", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        all_day: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("array");
            expect(response.body.error[0]).to.deep.equal({
                location: "body",
                msg: "Invalid value",
                param: "all_day",
                value: VALUE,
            });
        });
        it("should throw error when user_id is not a number", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                        user_id: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body).to.be.an("object").and.include.keys("error");

            expect(response.body.error).to.be.an("array");
            expect(response.body.error[0]).to.deep.equal({
                location: "body",
                msg: "Invalid value",
                param: "user_id",
                value: VALUE,
            });
        });

        it("should create a event on the specified calendar_id", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: 1,
                    })
                );

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success");

            expect(response.body.success).to.equal(
                "Event Successfully Created"
            );
        });
    });
});
