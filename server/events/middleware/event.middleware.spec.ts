import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import { createResponse, createRequest } from "node-mocks-http";
import EventMiddleware from "./event.middleware";
import express from "express";
import EventService from "../services/event.service";

describe("EventMiddleware", () => {
    let next: express.NextFunction;
    let eventMiddleware: EventMiddleware;
    beforeEach(() => {
        next = sinon.stub().callsFake(() => {});
        eventMiddleware = new EventMiddleware();
    });
    afterEach(() => {
        sinon.restore();
    });
    describe("method:startDateIsLessThanEndDate", async () => {
        it("should call next() when dates are in format:MM-DD-YYYY and date_end is after date_start", async () => {
            const body = {
                date_start: "08-15-2021",
                date_end: "08-16-2021",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).calledOnce;
            expect(res.statusCode).to.equal(200);
        });
        it("should call next() when dates are in format:YYYY-MM-DD and date_end is after date_start", async () => {
            const body = {
                date_start: "2021-08-15",
                date_end: "2021-08-16",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).calledOnce;
            expect(res.statusCode).to.equal(200);
        });
        it("should call next() when dates include time and are in format:YYYY-MM-DDTHH:mm and date_end is after date_start", async () => {
            const body = {
                date_start: "2021-08-15T15:30",
                date_end: "2021-08-15T15:45",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).calledOnce;
            expect(res.statusCode).to.equal(200);
        });

        it("should throw error when dates are in format:MM-DD-YYYY but date_end is before date_start", async () => {
            const body = {
                date_start: "08-15-2021",
                date_end: "08-14-2021",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`
            );
        });

        it("should throw error when dates are in format:YYYY-MM-DD but date_end is before date_start", async () => {
            const body = {
                date_start: "2021-08-15",
                date_end: "2021-08-14",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`
            );
        });

        it("should throw error when dates are in format:yyyy-mm-ddThh:mm but date_end is before date_start", async () => {
            const body = {
                date_start: "2021-08-15T15:45",
                date_end: "2021-08-15T15:30",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.startDateIsLessThanEndDate(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`
            );
        });
    });

    describe("method:validateEventExists", () => {
        let eventStub: SinonStub;
        beforeEach(() => {
            eventStub = sinon.stub(EventService.prototype, "readById");
        });
        it("should call next() if eventId exists in event collection", async () => {
            eventStub.resolves(true);
            const params = { eventId: 1 };

            let req = createRequest({ params });
            let res = createResponse();

            await eventMiddleware.validateEventExists(req, res, next);

            expect(eventStub).to.have.been.calledOnce;
            expect(eventStub).to.have.been.calledWith(params.eventId);
            expect(next).to.have.been.calledOnce;
            expect(res.statusCode).to.equal(200);
        });

        it("should throw error if event is undefined", async () => {
            eventStub.resolves(undefined);

            const params = { eventId: 1 };
            let req = createRequest({ params });
            let res = createResponse();

            await eventMiddleware.validateEventExists(req, res, next);

            expect(eventStub).to.have.been.calledOnce;
            expect(eventStub).to.have.been.calledWith(params.eventId);
            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.be.equal(404);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `Event ${req.params.eventId} not found`
            );
        });

        it("should throw error if event is null", async () => {
            eventStub.resolves(null);

            const params = { eventId: 1 };
            let req = createRequest({ params });
            let res = createResponse();

            await eventMiddleware.validateEventExists(req, res, next);

            expect(eventStub).to.have.been.calledOnce;
            expect(eventStub).to.have.been.calledWith(params.eventId);
            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.be.equal(404);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `Event ${req.params.eventId} not found`
            );
        });

        it('should throw error if event is ""', async () => {
            eventStub.resolves("");

            const params = { eventId: 1 };
            let req = createRequest({ params });
            let res = createResponse();

            await eventMiddleware.validateEventExists(req, res, next);

            expect(eventStub).to.have.been.calledOnce;
            expect(eventStub).to.have.been.calledWith(params.eventId);
            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.be.equal(404);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `Event ${req.params.eventId} not found`
            );
        });
    });

    describe("method:extractEventId", () => {
        it("should store req.params.eventId to req.body.eventId and call next()", async () => {
            const params = { eventId: 1 };
            let req = createRequest({ params });
            let res = createResponse();

            await eventMiddleware.extractEventId(req, res, next);

            expect(req).to.include.keys("body");
            expect(req.body).to.include.keys("eventId");
            expect(req.body.eventId).to.equal(params.eventId);
            expect(res.statusCode).to.equal(200);
            expect(next).to.have.been.calledOnce;
        });
    });

    describe("method:datesAreValid", () => {
        it("should return true if date is valid JS Date string of format:YYYY-MM-DD", async () => {
            const result: Boolean = await eventMiddleware.isDateValid(
                "1994-04-13"
            );

            expect(result).to.equal(true);
        });

        it("should return true if date is valid JS Date string of format:MM-DD-YYYY", async () => {
            const result: Boolean = await eventMiddleware.isDateValid(
                "04-13-1994"
            );

            expect(result).to.equal(true);
        });

        it("should return true if date is valid JS Date string of format:YYYY-MM-DDTHH:mmZ", async () => {
            const result: Boolean = await eventMiddleware.isDateValid(
                "1994-04-13T01:01Z"
            );

            expect(result).to.equal(true);
        });

        it("should return false if date is in format:MM-DD-YYYYTHH:mmZ", async () => {
            const result: Boolean = await eventMiddleware.isDateValid(
                "04-13-1994T23:23Z"
            );

            expect(result).to.equal(false);
        });

        it("should return false if date is invalid JS Date string", async () => {
            const result: Boolean = await eventMiddleware.isDateValid("XXXX");

            expect(result).to.equal(false);
        });

        it("should return true if date is invalid JS Date string", async () => {
            const result: Boolean = await eventMiddleware.isDateValid("XXXX");

            expect(result).to.equal(false);
        });
    });
});
