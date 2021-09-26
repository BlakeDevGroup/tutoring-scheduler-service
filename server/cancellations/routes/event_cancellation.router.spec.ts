import sinon from "sinon";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import EventCancellationRouter from "./event_cancellaton.router";

const CANCELLATION_ID = "1";
const EVENT_ID = "336";
const POST_EVENT_ID = "351";

const DATA = {
    event_id: POST_EVENT_ID,
    reason: "reason",
};

let app: express.Application = express();
app.use(express.json());
app.use("/", new EventCancellationRouter().configureRouter());

describe("EventCancellationRouter", () => {
    beforeEach(() => {});
    afterEach(() => {
        sinon.restore();
    });

    describe("GET /cancellations", () => {
        it("should get all cancellations with status 200", async () => {
            const response = await request(app)
                .get("/cancellations")
                .send({ event_id: EVENT_ID });

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved event cancellations"
            );
        });
    });

    describe("POST /cancellations", () => {
        it("when a cancellation exists on event_id then send error with status 400", async () => {
            const response = await request(app)
                .post("/cancellations")
                .send(Object.assign({}, DATA, { event_id: EVENT_ID }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Event: ${EVENT_ID} is already cancelled`
            );
        });

        it("when event_id is not numeric then send error with status 400", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .post("/cancellations")
                .send(Object.assign({}, DATA, { event_id: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: event_id value: ${VALUE}`
            );
        });

        it("when reason is not a string then send error with status 400", async () => {
            const VALUE = 123;
            const response = await request(app)
                .post("/cancellations")
                .send(Object.assign({}, DATA, { reason: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: reason value: ${VALUE}`
            );
        });

        it("should create cancellation with status 200", async () => {
            const response = await request(app)
                .post("/cancellations")
                .send(DATA);

            expect(response.statusCode).to.equal(201);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully created event cancellation"
            );
        });
    });

    describe("PUT /cancellations", () => {
        it("when cancellation does not exist on event_id then send status 404", async () => {
            const response = await request(app)
                .put("/cancellations")
                .send(DATA);

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `No cancellation associated with event_id: ${POST_EVENT_ID}`
            );
        });

        it("when event_id is not numeric then send status 404", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .put("/cancellations")
                .send(Object.assign({}, DATA, { event_id: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: event_id value: ${VALUE}`
            );
        });

        it("when reason is not numeric then send status 404", async () => {
            const VALUE = 123;
            const response = await request(app)
                .put("/cancellations")
                .send(Object.assign({}, DATA, { reason: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: reason value: ${VALUE}`
            );
        });

        it("should update cancellation and send status 200", async () => {
            const response = await request(app)
                .put("/cancellations")
                .send(Object.assign({}, DATA, { event_id: EVENT_ID }));

            expect(response.statusCode).to.equal(200);
            expect(response.body.data.cancellation_id).to.equal(
                CANCELLATION_ID
            );
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated cancellation`
            );

            expect(response.body.data).to.eql(
                Object.assign(
                    {},
                    DATA,
                    { event_id: EVENT_ID },
                    { cancellation_id: CANCELLATION_ID }
                )
            );
        });
    });

    describe("PATCH /cancellations", () => {
        it("when cancellation does not exist on event_id then send status 404", async () => {
            const response = await request(app)
                .patch("/cancellations")
                .send(DATA);

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `No cancellation associated with event_id: ${POST_EVENT_ID}`
            );
        });

        it("when event_id is not numeric then send status 404", async () => {
            const VALUE = "XXX";
            const response = await request(app)
                .patch("/cancellations")
                .send(Object.assign({}, DATA, { event_id: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: event_id value: ${VALUE}`
            );
        });

        it("when reason is not numeric then send status 404", async () => {
            const VALUE = 123;
            const response = await request(app)
                .patch("/cancellations")
                .send(Object.assign({}, DATA, { reason: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: reason value: ${VALUE}`
            );
        });

        it("should update cancellation and send status 200", async () => {
            const response = await request(app)
                .patch("/cancellations")
                .send(Object.assign({}, DATA, { event_id: EVENT_ID }));

            expect(response.statusCode).to.equal(200);

            expect(response.body.data.cancellation_id).to.equal(
                CANCELLATION_ID
            );
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully updated cancellation`
            );

            expect(response.body.data).to.eql(
                Object.assign(
                    {},
                    DATA,
                    { event_id: EVENT_ID },
                    { cancellation_id: CANCELLATION_ID }
                )
            );
        });
    });

    describe("DELETE /cancellations", () => {
        it("when cancellation does not exist on event_id then send status 404", async () => {
            const response = await request(app)
                .delete("/cancellations")
                .send({ event_id: POST_EVENT_ID });

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `No cancellation associated with event_id: ${POST_EVENT_ID}`
            );
        });

        it("should delete cancellation and send status 200", async () => {
            const response = await request(app)
                .delete("/cancellations")
                .send({ event_id: EVENT_ID });

            expect(response.statusCode).to.equal(200);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                `Successfully removed event cancellation`
            );
        });
    });
});
