import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import { createResponse, createRequest } from "node-mocks-http";
import eventMiddleware from "./event.middleware";
import express from "express";
import EventService from "../services/event.service";

describe("EventMiddleware", () => {
    let next: express.NextFunction;
    beforeEach(() => {
        next = sinon.stub().callsFake(() => {});
    });
    afterEach(() => {
        sinon.restore();
    });
    describe("method:validateDates", async () => {
        it("should call next() when dates are in format:MM-DD-YYYY and date_end is after date_start", async () => {
            const body = {
                date_start: "08-15-2021",
                date_end: "08-16-2021",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.validateDates(req, res, next);

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

            await eventMiddleware.validateDates(req, res, next);

            expect(next).calledOnce;
            expect(res.statusCode).to.equal(200);
        });
        it("should call next() when dates include time and are in format:yyyy-mm-ddThh:mm and date_end is after date_start", async () => {
            const body = {
                date_start: "2021-08-15T15:30",
                date_end: "2021-08-15T15:45",
            };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventMiddleware.validateDates(req, res, next);

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

            await eventMiddleware.validateDates(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`
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

            await eventMiddleware.validateDates(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`
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

            await eventMiddleware.validateDates(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`
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
        it("should call next() if start_date and end_date are valid JS date strings", async () => {
            const body = {
                start_date: "2018-09-10",
                end_date: "2018-09-10",
            };
            let req = createRequest({ body });
            let res = createResponse();

            await eventMiddleware.datesAreValid(req, res, next);

            expect(next).to.have.been.calledOnce;
            expect(res.statusCode).to.equal(200);
        });

        it("should send error and status code 400 if start_date is invalid", async () => {
            const body = {
                start_date: "XXXX",
                end_date: "2018-09-10",
            };
            let req = createRequest({ body });
            let res = createResponse();

            await eventMiddleware.datesAreValid(req, res, next);

            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                "The following dates are invalid: start_date"
            );
        });

        it("should send error and status code 400 if end_date is invalid", async () => {
            const body = {
                start_date: "2018-09-10",
                end_date: "XXXX",
            };
            let req = createRequest({ body });
            let res = createResponse();

            await eventMiddleware.datesAreValid(req, res, next);

            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                "The following dates are invalid: end_date"
            );
        });

        it("should send error and status code 400 if start_date and end_date is invalid", async () => {
            const body = {
                start_date: "XXXX",
                end_date: "XXXX",
            };
            let req = createRequest({ body });
            let res = createResponse();

            await eventMiddleware.datesAreValid(req, res, next);

            expect(next).to.have.not.been.called;
            expect(res.statusCode).to.equal(400);
            expect(res._getData()).to.include.keys("error");
            expect(res._getData().error).to.equal(
                "The following dates are invalid: start_date, end_date"
            );
        });
    });
});
