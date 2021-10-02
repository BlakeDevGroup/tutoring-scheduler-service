import sinon, { SinonSandbox, SinonSpy, SinonStub } from "sinon";
import { expect } from "chai";
import { createResponse, createRequest } from "node-mocks-http";
import express from "express";
import { ServerResponsePayload } from "../../common/services/message/message.service";

import SeriesMiddleware from "./series.middleware";
import SeriesService from "../services/series.service";
import * as messageService from "../../common/services/message/message.service";

const RESOLVED: ServerResponsePayload = {
    message: "Success",
    statusCode: 200,
    data: [],
    success: true,
};

const FAILED: ServerResponsePayload = {
    message: "Failed",
    statusCode: 404,
    error: new Error("Failed"),
    success: false,
};

let next: express.NextFunction;
let stub: SinonStub;
let seriesMiddleware: SeriesMiddleware;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;

describe("SeriesMiddleware", () => {
    before(() => {
        sandBox = sinon.createSandbox();
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });
    after(() => {
        sandBox.restore();
    });
    beforeEach(() => {
        next = sandBox.stub().callsFake(() => {});
        seriesMiddleware = new SeriesMiddleware();
        stub = sandBox.stub();
    });

    afterEach(() => {
        sinon.restore();
        spyFailure.resetHistory();
    });

    describe("series id should exist on calendar id", () => {
        it("should call next() with proper arguments", async () => {
            stub = sinon
                .stub(SeriesService.prototype, "readByIdAndCalendarId")
                .resolves(RESOLVED);
            let req = createRequest({
                params: { series_id: 1 },
                body: { calendar_id: 1 },
            });

            let res = createResponse();

            await seriesMiddleware.validateSeriesExists(req, res, next);

            expect(stub).calledOnce;
            expect(stub).calledWith(1, 1);

            expect(next).calledOnce;
        });

        it("when success == false then send 404 with error response", async () => {
            stub = sinon
                .stub(SeriesService.prototype, "readByIdAndCalendarId")
                .resolves(FAILED);

            let req = createRequest({
                params: { series_id: 1 },
                body: { calendar_id: 1 },
            });

            let res = createResponse();
            let spy = sinon.spy(res, "status");
            let spySend = sinon.spy(res, "send");

            await seriesMiddleware.validateSeriesExists(req, res, next);

            expect(next).not.called;
            expect(res.statusCode).to.equal(404);
            expect(res._getData()).to.equal(FAILED);

            expect(spy).calledOnceWith(FAILED.statusCode);
            expect(spySend).calledOnceWith(FAILED);
        });
    });

    describe("validate start_recur:start_time < end_recur:end_time", () => {
        it("when start_recur:start_time < end_recur:end_time in format DD-MM-YYYYhh:mm then return true", async () => {
            let req = createRequest({
                body: {
                    start_time: "10:30",
                    end_time: "11:30",
                    start_recur: "2021-08-31",
                    end_recur: "2021-08-31",
                },
            });

            let res = createResponse();

            await seriesMiddleware.datesAreValid(req, res, next);

            expect(next).calledOnce;
        });

        it("when start datetime > end datetime then sendFailure and status 400 ", async () => {
            let req = createRequest({
                body: {
                    start_time: "10:30",
                    end_time: "9:30",
                    start_recur: "2021-8-31",
                    end_recur: "2021-8-31",
                },
            });

            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesMiddleware.datesAreValid(req, res, next);

            expect(next).not.called;
            expect(spy).calledOnceWith(400);
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                `Start datetime ${req.body.start_recur}T${req.body.start_time} occurs after end datetime ${req.body.end_recur}T${req.body.end_time}`
            );
        });
    });

    describe("validate time", () => {
        it("when time matches regex then return true", () => {
            const result = seriesMiddleware.validateTime("10:30");

            expect(result).to.equal(true);
        });

        it("when time does not match regex then return false", () => {
            const result = seriesMiddleware.validateTime("XXXX");

            expect(result).to.equal(false);
        });
    });

    describe("validate date", () => {
        it("when date matches regex then return true", () => {
            const result = seriesMiddleware.validateDate("1994-04-13");

            expect(result).to.equal(true);
        });

        it("when date does not match regex then return false", () => {
            const result = seriesMiddleware.validateDate("XXXX");

            expect(result).to.equal(false);
        });
    });

    describe("extract series id to body", () => {
        it("should extract series id from req.param and store to req.body and call next()", async () => {
            let req = createRequest({
                params: { series_id: 1 },
            });
            let res = createResponse();

            await seriesMiddleware.extractSeriesId(req, res, next);

            expect(req.body.series_id).to.equal(req.params.series_id);
            expect(next).calledOnce;
        });
    });

    describe("validateDateEnd", () => {
        let spy: SinonSpy;

        afterEach(() => {
            spy.restore();
        });

        beforeEach(() => {
            spy = sinon.spy(SeriesMiddleware.prototype, "validateDate");
        });
        it("when date evaluates to false then return true", () => {
            let result = seriesMiddleware.validateDateEnd("");

            expect(result).to.equal(true);

            result = seriesMiddleware.validateDateEnd(null);

            expect(result).to.equal(true);

            result = seriesMiddleware.validateDateEnd(undefined);
        });

        it("when date end evalutes to a date then return true", () => {
            let result = seriesMiddleware.validateDateEnd("2021-10-15");

            expect(result).to.equal(true);

            expect(spy).calledOnce;

            expect(spy).calledWith("2021-10-15");
        });
    });
});
