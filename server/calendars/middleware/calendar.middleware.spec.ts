import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createResponse, createRequest } from "node-mocks-http";
import express from "express";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import CalendarMiddleware from "./calendar.middleware";
import CalendarService from "../services/calendar.service";
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
let calendarMiddleWare: CalendarMiddleware;
let stub: SinonStub;

describe("CalendarMiddleware", () => {
    beforeEach(() => {
        next = sinon.stub().callsFake(() => {});
        calendarMiddleWare = new CalendarMiddleware();
        stub = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should extract calendar id from parameter and call next()", async () => {
        let req = createRequest({
            params: { calendar_id: 1 },
        });

        let res = createResponse();

        await calendarMiddleWare.extractCalendarId(req, res, next);

        expect(next).calledOnce;
        expect(req.body).to.include.keys("calendar_id");
        expect(req.body.calendar_id).to.equal(1);
    });
    describe("should validate if calendar exists", () => {
        it("calendar exists and next() is called", async () => {
            stub = sinon
                .stub(CalendarService.prototype, "readById")
                .resolves(RESOLVED);

            let req = createRequest({
                params: { calendar_id: 1 },
            });
            let res = createResponse();

            await calendarMiddleWare.validateCalendarExists(req, res, next);

            expect(next).calledOnce;
            expect(stub).calledOnce;
            expect(stub).calledWith(1);
        });

        it("calendar does not exist and sendsFailure of status 404", async () => {
            stub = sinon
                .stub(CalendarService.prototype, "readById")
                .resolves(FAILED);

            let req = createRequest({
                params: { calendar_id: 1 },
            });
            let res = createResponse();

            await calendarMiddleWare.validateCalendarExists(req, res, next);

            expect(next).not.called;
            expect(stub).calledOnce;
            expect(stub).calledWith(1);
            expect(res.statusCode).to.equal(404);
            expect(res._getData())
                .to.be.an("object")
                .and.include.keys("success", "message", "error");
            expect(res._getData().message).to.equal(FAILED.message);
            expect(res._getData().success).to.equal(FAILED.success);
            expect(res._getData().statusCode).to.equal(FAILED.statusCode);
        });
    });
});
