import sinon, { SinonSandbox, SinonSpy, SinonStub } from "sinon";
import { expect } from "chai";
import { createResponse, createRequest } from "node-mocks-http";
import express from "express";
import { ServerResponsePayload } from "../../common/services/message/message.service";

import EventCancellationMiddleware from "./event_cancellation.middleware";
import EventCancellationService from "../services/event_cancellation.service";
import * as messageService from "../../common/services/message/message.service";

const RESOLVED: ServerResponsePayload = {
    message: "Success",
    statusCode: 200,
    data: [
        {
            cancellation_id: "1",
        },
    ],
    success: true,
};

const FAILED: ServerResponsePayload = {
    message: "Failed",
    statusCode: 404,
    error: new Error("Failed"),
    success: false,
};

const ID = "1";

let next: express.NextFunction;
let stub: SinonStub;
let middleware: EventCancellationMiddleware;
let spyFailure: SinonSpy;
let spy: SinonSpy;
let sandBox: SinonSandbox;

describe("EventCancellationMiddleware", () => {
    before(() => {
        sandBox = sinon.createSandbox();
    });

    after(() => {
        sandBox.restore();
    });

    beforeEach(() => {
        next = sandBox.stub().callsFake(() => {});
        middleware = new EventCancellationMiddleware();
    });

    afterEach(() => {
        stub.restore();
        sandBox.restore();
    });

    describe("validate event cancellation exists", () => {
        it("when success then call next()", async () => {
            stub = sandBox
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(RESOLVED);
            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });

            let res = createResponse();

            await middleware.validateEventCancellationExists(req, res, next);

            expect(stub).calledOnceWith(ID);
            expect(req.body.cancellation_id).equals(
                RESOLVED.data[0].cancellation_id
            );

            expect(next).calledOnce;
        });

        it("when failed then send status 404", async () => {
            stub = sandBox
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(FAILED);

            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });

            let res = createResponse();
            let spy = sandBox.stub(res, "status");

            await middleware.validateEventCancellationExists(req, res, next);

            expect(spy).calledOnceWith(FAILED.statusCode);
            expect(res._getData()).eql(FAILED);
        });
    });

    describe("validate cancellation does not exist on event_id", () => {
        it("when cancellation does not exist on event_id then call next()", async () => {
            stub = sandBox
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(FAILED);

            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });

            let res = createResponse();

            await middleware.validateCancellationDoesNotExistOnEvent(
                req,
                res,
                next
            );

            expect(stub).calledOnceWith(ID);

            expect(next).calledOnce;
        });

        it("when cancellation exists on event_id then send failure with status 400", async () => {
            stub = sandBox
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(RESOLVED);

            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });

            let res = createResponse();
            spy = sandBox.spy(res, "status");
            spyFailure = sandBox.spy(messageService, "sendFailure");
            await middleware.validateCancellationDoesNotExistOnEvent(
                req,
                res,
                next
            );

            expect(next).not.called;

            expect(spy).calledOnceWith(400);

            expect(spyFailure).calledOnce;
            expect(spyFailure.args[0][0]).to.equal(
                `Event: ${ID} is already cancelled`
            );
            expect(spyFailure.args[0][2]).to.equal(400);
        });
    });
});
