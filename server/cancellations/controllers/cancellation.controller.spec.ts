import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createRequest, createResponse } from "node-mocks-http";
import CancellationController from "./cancellation.controller";
import CancellationService from "../services/cancellation.service";
import { afterEach } from "mocha";

let cancellationController: CancellationController;
let cancellationServiceStub: SinonStub;

const CANCELLATION_ID = "1";
const CANCELLATION_DATA = {
    amount: 45,
    reason: "Reason here",
    id: 1,
    source: "event",
};

const RESOLVED = (statusCode = 200) => {
    return {
        success: true,
        message: "PROCESS RESOLVED",
        statusCode: statusCode,
    };
};
const ERROR = new Error("PROCESS FAILED");
const FAILED = (statusCode = 400) => {
    return {
        success: false,
        message: "PROCESS FAILED",
        statusCode: statusCode,
        error: ERROR,
    };
};

describe("CancellationController", () => {
    beforeEach(() => {
        cancellationController = new CancellationController();
        cancellationServiceStub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        cancellationServiceStub.restore();
    });

    describe("list all series", () => {
        it("should run list service procedure and send success with 200 status", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "list")
                .resolves(RESOLVED(200));

            let req = createRequest();
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.listCancellations(req, res);

            expect(cancellationServiceStub).calledOnceWith(100, 0);

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run list service procedure and send failed with 400 status", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "list")
                .resolves(FAILED(400));

            let req = createRequest();
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.listCancellations(req, res);

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("get a cancellation", () => {
        it("should run get service procedure and send success with status 200", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "readById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: {
                    cancellation_id: CANCELLATION_ID,
                },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.getCancellationById(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_ID);

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run get service procedure and send failure with status 400", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "readById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    cancellation_id: CANCELLATION_ID,
                },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.getCancellationById(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_ID);

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("create a cancellation", () => {
        it("should run create procedure and send success with status 200", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "create")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: CANCELLATION_DATA,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.createCancellation(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_DATA);

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run create procedure and send failure with status 400", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "create")
                .resolves(FAILED(400));

            let req = createRequest({
                body: CANCELLATION_DATA,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.createCancellation(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_DATA);

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("patch a cancellation", () => {
        const REQUEST_BODY = Object.assign(
            {},
            { cancellation_id: CANCELLATION_ID },
            CANCELLATION_DATA
        );
        it("should run patch procedure and send success with status 200", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "patchById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: REQUEST_BODY,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.patch(req, res);

            expect(cancellationServiceStub).calledOnceWith(
                CANCELLATION_ID,
                REQUEST_BODY
            );

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run patch procedure and send failure with status 400", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "patchById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: REQUEST_BODY,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.patch(req, res);

            expect(cancellationServiceStub).calledOnceWith(
                CANCELLATION_ID,
                REQUEST_BODY
            );

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("put a cancellation", () => {
        const REQUEST_BODY = Object.assign(
            {},
            { cancellation_id: CANCELLATION_ID },
            CANCELLATION_DATA
        );
        it("should run put procedure and send success with status 200", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "putById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: REQUEST_BODY,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.put(req, res);

            expect(cancellationServiceStub).calledOnceWith(
                CANCELLATION_ID,
                REQUEST_BODY
            );

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run put procedure and send failure with status 400", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "putById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: REQUEST_BODY,
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.put(req, res);

            expect(cancellationServiceStub).calledOnceWith(
                CANCELLATION_ID,
                REQUEST_BODY
            );

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("remove a cancellation", () => {
        it("should run remove procedure and send success with status 200", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "deleteById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: {
                    cancellation_id: CANCELLATION_ID,
                },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.removeCancellation(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_ID);

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run remove procedure and send failure with status 400", async () => {
            cancellationServiceStub = sinon
                .stub(CancellationService.prototype, "deleteById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    cancellation_id: CANCELLATION_ID,
                },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await cancellationController.removeCancellation(req, res);

            expect(cancellationServiceStub).calledOnceWith(CANCELLATION_ID);

            expect(res.statusCode).to.equal(400);
            expect(spy).calledOnceWith(res.statusCode);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });
});
