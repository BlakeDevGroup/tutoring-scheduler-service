import sinon from "sinon";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import EventRouter from "./event.router";
const CALENDAR_ID = "2";
const EVENT_ID = "319";
// import app from "../../../app";
type Payload = {
    date_end: string;
    date_start: string;
    title: string;
    all_day: Boolean;
    user_id: number;
    description: string;
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
            description: "Test Event",
        };
    });
    afterEach(() => {
        sinon.restore();
    });
    describe("GET /events", () => {
        it("should send all events of calendar_id", async () => {
            const response = await request(app)
                .get("/events")
                .send({ calendar_id: CALENDAR_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved events"
            );
            expect(response.body.data).to.be.an("array");
            expect(response.body.data[0])
                .to.be.an("object")
                .and.include.keys(
                    "date_end",
                    "date_start",
                    "event_id",
                    "title",
                    "all_day",
                    "user_id",
                    "calendar_id"
                );
        });

        it("should send an empty array when there are no events on calendar_id", async () => {
            const response = await request(app)
                .get("/events")
                .send({ calendarId: 99999 });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved events"
            );
            expect(response.body.data).to.deep.equal([]);
        });
    });

    describe("GET /events/:id", () => {
        it("should send event when event_id exists on calendar_id", async () => {
            const response = await request(app)
                .get(`/events/${EVENT_ID}`)
                .send({ calendar_id: CALENDAR_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.be.an("object");
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved event"
            );
            expect(response.body.data)
                .to.be.an("object")
                .and.include.keys(
                    "date_end",
                    "date_start",
                    "event_id",
                    "title",
                    "all_day",
                    "user_id",
                    "calendar_id"
                );
        });

        it("should send error when event_id does not exist on calendar_id", async () => {
            const EVENT_ID = 9999;
            const response = await request(app)
                .get(`/events/${EVENT_ID}`)
                .send({ calendar_id: 1 });

            expect(response.statusCode).to.equal(404);
            expect(response.body)
                .to.be.an("object")
                .and.includes.keys("success", "message", "error", "statusCode");
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Event with id: ${EVENT_ID} does not exist on calendar with id: 1`
            );
        });
    });

    describe("POST /events", () => {
        it("should throw error when date_start is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        date_start: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                "Invalid Value for param: date_start value: XXXX"
            );
            expect(response.body.success).to.equal(false);
        });

        it("should throw error when date_end is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        date_end: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                "Invalid Value for param: date_end value: XXXX"
            );
            expect(response.body.success).to.equal(false);
        });

        it("should throw error when date_end is a date before date_start", async () => {
            const VALUE = "2021-07-28T15:30";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        date_end: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                `date_end (${VALUE}) occurs before date_start (${PAYLOAD.date_start})`
            );
            expect(response.body.success).to.equal(false);
        });

        it("should throw error when title is not a string", async () => {
            const VALUE = 123;

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        title: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                "Invalid Value for param: title value: 123"
            );
            expect(response.body.success).to.equal(false);
        });

        it("should throw error when all_day is not a boolean", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        all_day: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                "Invalid Value for param: all_day value: XXXX"
            );
            expect(response.body.success).to.equal(false);
        });
        it("should throw error when user_id is not a number", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendarId: CALENDAR_ID,
                        user_id: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "message", "statusCode", "success");

            expect(response.body.message).to.equal(
                "Invalid Value for param: user_id value: XXXX"
            );
            expect(response.body.success).to.equal(false);
        });

        it("should create a event on the specified calendar_id", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .post("/events")
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                    })
                );

            expect(response.statusCode).to.equal(201);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "statusCode", "data", "message");

            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.deep.equal([]);
            expect(response.body.message).to.equal(
                "Event created successfully"
            );
        });
    });

    describe("/events/:id", () => {
        it("should return error object and status code 404 when event is not found", async function () {
            const response = await request(app)
                .get("/events/9999")
                .send(Object.assign(PAYLOAD, { calendar_id: 1 }));

            expect(response.statusCode).to.equal(404);
            expect(response.body).to.be.an("object");
            expect(response.body).to.include.keys(
                "success",
                "error",
                "message"
            );
            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Event with id: 9999 does not exist on calendar with id: 1`
            );
        });
        it("should throw error when date_start is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                        date_start: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "success", "message");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid Value for param: date_start value: ${VALUE}`
            );
        });

        it("should throw error when date_end is not a valid JS Date string", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                        date_end: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "success", "message");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid Value for param: date_end value: ${VALUE}`
            );
        });

        it("should throw error when title is not a string", async () => {
            const VALUE = 123;

            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                        title: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "success", "message");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid Value for param: title value: ${VALUE}`
            );
        });

        it("should throw error when all_day is not a boolean", async () => {
            const VALUE = 123;

            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                        all_day: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "success", "message");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid Value for param: all_day value: ${VALUE}`
            );
        });

        it("should throw error when user_id is not a number", async () => {
            const VALUE = "XXXX";

            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(
                    Object.assign(PAYLOAD, {
                        calendar_id: CALENDAR_ID,
                        user_id: VALUE,
                    })
                );

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("error", "success", "message");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid Value for param: user_id value: ${VALUE}`
            );
        });

        it("should update an event and send status 200 with event data", async () => {
            const response = await request(app)
                .put(`/events/${EVENT_ID}`)
                .send(Object.assign(PAYLOAD, { calendar_id: CALENDAR_ID }));

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("data", "success", "message");

            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.deep.equal(
                Object.assign(PAYLOAD, {
                    calendar_id: CALENDAR_ID,
                    event_id: EVENT_ID,
                })
            );
            expect(response.body.message).to.equal(
                `Successfully updated event id: ${EVENT_ID}`
            );
        });

        it("should update an event and send status 200 with event data", async () => {
            const response = await request(app)
                .patch(`/events/${EVENT_ID}`)
                .send(Object.assign(PAYLOAD, { calendar_id: CALENDAR_ID }));

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("data", "success", "message");

            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.deep.equal(
                Object.assign(PAYLOAD, {
                    calendar_id: CALENDAR_ID,
                    event_id: EVENT_ID,
                })
            );
            expect(response.body.message).to.equal(
                `Successfully patched event id: ${EVENT_ID}`
            );
        });

        it("should delete an event and send status 200", async () => {
            const response = await request(app)
                .delete(`/events/${EVENT_ID}`)
                .send(Object.assign(PAYLOAD, { calendar_id: CALENDAR_ID }));

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("data", "success", "message");

            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.deep.equal([]);
            expect(response.body.message).to.equal(
                "Successfully removed event"
            );
        });
    });

    describe("GET /events/:event_id", () => {
        it("should return error when event_id does not exist on calendar_id", async () => {
            const EVENT_ID = 35;
            const response = await request(app)
                .get(`/events/${EVENT_ID}`)
                .send({ calendar_id: 2 });

            expect(response.statusCode).to.equal(404);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Event with id: ${EVENT_ID} does not exist on calendar with id: 2`
            );
        });
    });
});
