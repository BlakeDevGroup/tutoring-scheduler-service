import sinon, { SinonSandbox, SinonSpy, SinonStub } from "sinon";
import { expect } from "chai";
import { createResponse, createRequest } from "node-mocks-http";
import express from "express";
import { ServerResponsePayload } from "../../common/services/message/message.service";

import CancellationMiddleware from "./cancellation.middleware";
import CancellationService from "../services/cancellation.service";
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

const CANCELLATION_ID = "1";

let next: express.NextFunction;
let stub: SinonStub;
let cancellationMiddleware: CancellationMiddleware;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;

describe("CancellationMiddleware", () => {
    before(() => {
        sandBox = sinon.createSandbox();
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });

    after(() => {
        sandBox.restore();
    });

    beforeEach(() => {
        next = sandBox.stub().callsFake(() => {});
        cancellationMiddleware = new CancellationMiddleware();
    });

    afterEach(() => {
        stub.restore();
    });

    describe("validate cancellation exists", () => {
        it("when success is returned then next should be called", async () => {
            stub = sandBox
                .stub(CancellationService.prototype, "readById")
                .resolves(RESOLVED);

            let req = createRequest({
                params: {
                    cancellation_id: CANCELLATION_ID,
                },
            });

            let res = createResponse();
            await cancellationMiddleware.validateCancellationExists(
                req,
                res,
                next
            );

            expect(stub).calledOnceWith(CANCELLATION_ID);

            expect(next).to.be.calledOnce;
        });

        it("when failed is returned then send failure with status 404", async () => {
            stub = sandBox
                .stub(CancellationService.prototype, "readById")
                .resolves(FAILED);

            let req = createRequest({
                params: {
                    cancellation_id: CANCELLATION_ID,
                },
            });

            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationMiddleware.validateCancellationExists(
                req,
                res,
                next
            );

            expect(next).not.calledOnce;

            expect(spy).calledWith(404);
            expect(res._getData()).to.eql(FAILED);
        });
    });

    describe("extract cancellation id", () => {
        it("should set req.body.cancellation_id equal to req.params.cancellation_id and call next()", async () => {
            let req = createRequest({
                params: {
                    cancellation_id: CANCELLATION_ID,
                },
            });

            let res = createResponse();

            await cancellationMiddleware.extractCancellationId(req, res, next);

            expect(req.body.cancellation_id).to.equal(CANCELLATION_ID);
            expect(next).calledOnce;
        });
    });
});
