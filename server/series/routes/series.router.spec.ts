import sinon from "sinon";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import SeriesRouter from "./series.router";

let SERIES_DATA: Object;
const CALENDAR_ID = "2";
const SERIES_ID = "48";
const COMPANY_ID = "128";
let app: express.Application = express();
app.use(express.json());
app.use("/", new SeriesRouter().configureRouter());

describe("SeriesRoutes", () => {
    beforeEach(() => {
        SERIES_DATA = {
            title: "Test Series",
            description: "Test Series description",
            calendar_id: CALENDAR_ID,
            start_time: "10:30",
            end_time: "14:30",
            start_recur: "2021-08-31",
            end_recur: "2022-08-31",
            days_of_week: [0, 1, 2],
            user_id: "1",
            company_id: COMPANY_ID,
        };
    });
    afterEach(() => {
        sinon.restore();
    });

    describe("GET /series", () => {
        it("should return all series with status 200", async () => {
            const response = await request(app)
                .get("/series")
                .send({ calendar_id: CALENDAR_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved all series"
            );

            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.be.greaterThan(0);

            expect(response.body.data[0])
                .to.be.an("object")
                .and.include.keys(
                    "title",
                    "description",
                    "series_id",
                    "calendar_id",
                    "start_time",
                    "end_time",
                    "start_recur",
                    "end_recur",
                    "days_of_week"
                );
        });
    });

    describe("POST /series", () => {
        it("when user_id is not a numeric then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { user_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: user_id value: ${VALUE}`
            );
        });

        it("when company_id is not a numeric then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { company_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: company_id value: ${VALUE}`
            );
        });

        it("when title is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { title: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: title value: ${VALUE}`
            );
        });
        it("when description is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { description: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: description value: ${VALUE}`
            );
        });
        it("when start_time is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { start_time: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: start_time value: ${VALUE}`
            );
        });

        it("when end_time is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { end_time: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: end_time value: ${VALUE}`
            );
        });

        it("when start_recur is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { start_recur: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: start_recur value: ${VALUE}`
            );
        });

        it("when end_recur is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { end_recur: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: end_recur value: ${VALUE}`
            );
        });

        it("when days_of_week is not an array then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { days_of_week: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: days_of_week value: ${VALUE}`
            );
        });
        it("when start_time > end_time then return error with status 400", async () => {
            const response = await request(app)
                .post("/series")
                .send(
                    Object.assign(SERIES_DATA, {
                        start_time: "10:30",
                        end_time: "09:30",
                        end_recur: "2021-08-31",
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Start datetime 2021-08-31T10:30 occurs after end datetime 2021-08-31T09:30`
            );
        });

        it("when start_recur > end_recur then return error with status 400", async () => {
            const response = await request(app)
                .post("/series")
                .send(
                    Object.assign(SERIES_DATA, {
                        start_recur: "2021-08-31",
                        end_recur: "2021-08-30",
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Start datetime 2021-08-31T10:30 occurs after end datetime 2021-08-30T14:30`
            );
        });

        it("when start_time is an invalid numeral string then return error with status 400", async () => {
            const VALUE = "XXXX";
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { start_time: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: start_time value: ${VALUE}`
            );
        });

        it("when end_time is an invalid numeral string then return error with status 400", async () => {
            const VALUE = "XXXX";
            const response = await request(app)
                .post("/series")
                .send(Object.assign(SERIES_DATA, { end_time: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: end_time value: ${VALUE}`
            );
        });

        it("when payload is valid then create a series and send status 201", async () => {
            const response = await request(app)
                .post("/series")
                .send(SERIES_DATA);

            expect(response.statusCode).to.equal(201);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data", "statusCode");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully created series"
            );
            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.equal(0);
        });
    });

    describe("GET /series/:series_id", () => {
        it("when series_id does not exist on calendar_id then send 404 and error message", async () => {
            const response = await request(app)
                .get("/series/999")
                .send({ calendar_id: 1 });

            expect(response.statusCode).to.equal(404);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Series with id: 999 does not exist on calendar with id: 1`
            );
        });

        it("when series_id exist on calendar_id then send 200 and series data", async () => {
            const response = await request(app)
                .get(`/series/${SERIES_ID}`)
                .send({ calendar_id: CALENDAR_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data", "statusCode");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully retrieved series`
            );
            expect(response.body.data).to.be.an("object");
        });
    });

    describe("DELETE /series/:series_id", () => {
        it("when delete is successful then send 200 status", async () => {
            const response = await request(app)
                .delete(`/series/${SERIES_ID}`)
                .send({ calendar_id: CALENDAR_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data", "statusCode");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully removed series`
            );
            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.equal(0);
        });
    });

    describe("PUT /series/:series_id", () => {
        it("when user_id is not a numeric then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .put(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { user_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: user_id value: ${VALUE}`
            );
        });

        it("when company_id is not a numeric then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .put(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { company_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: company_id value: ${VALUE}`
            );
        });

        it("when title is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .put(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { title: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: title value: ${VALUE}`
            );
        });

        it("when put is successful then send 200 status", async () => {
            const response = await request(app)
                .put(`/series/${SERIES_ID}`)
                .send(SERIES_DATA);

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data", "statusCode");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated series`
            );
            expect(response.body.data).to.be.an("object");
            expect(response.body.data).to.deep.equal(
                Object.assign(SERIES_DATA, { series_id: SERIES_ID })
            );
        });
    });

    describe("PATCH /series/:series_id", () => {
        it("when user_id is not a string then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .patch(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { user_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: user_id value: ${VALUE}`
            );
        });

        it("when company_id is not a string then return error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .patch(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { company_id: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: company_id value: ${VALUE}`
            );
        });
        it("when title is not a string then return error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .patch(`/series/${SERIES_ID}`)
                .send(Object.assign(SERIES_DATA, { title: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error", "statusCode");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: title value: ${VALUE}`
            );
        });

        it("when patch is successful then send 200 status", async () => {
            const response = await request(app)
                .patch(`/series/${SERIES_ID}`)
                .send(SERIES_DATA);

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data", "statusCode");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated series`
            );
            expect(response.body.data).to.be.an("object");
            expect(response.body.data).to.deep.equal(
                Object.assign(SERIES_DATA, { series_id: SERIES_ID })
            );
        });
    });
});
