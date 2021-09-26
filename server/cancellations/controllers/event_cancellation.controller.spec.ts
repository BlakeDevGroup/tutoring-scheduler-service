import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createRequest, createResponse } from "node-mocks-http";
import EventCancellationController from "./event_cancellation.controller";
import EventCancellationService from "../services/event_cancellation.service";
import { afterEach } from "mocha";

let stub: SinonStub;
let controller: EventCancellationController;
const ID = "1";
const DATA = {
    event_id: "1",
    reason: "reason",
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

describe("CacnellationController", () => {
    beforeEach(() => {
        controller = new EventCancellationController();
        stub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        stub.restore();
    });

    describe("list cancellations", () => {
        it("should run service procedure and send success with status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "list")
                .resolves(RESOLVED(200));

            let req = createRequest();
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.listCancellations(req, res);

            expect(stub).calledOnceWith(100, 1);

            expect(statusSpy).calledOnceWith(200);

            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure and send failure with status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "list")
                .resolves(FAILED(400));
            let req = createRequest();
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.listCancellations(req, res);

            expect(statusSpy).calledOnceWith(400);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("get cancellation by id", () => {
        it("should run service procedure and send success with status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "getById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: {
                    cancellation_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.getCancellationById(req, res);

            expect(stub).calledOnceWith(ID);

            expect(statusSpy).calledOnceWith(200);

            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure and send failure with status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "getById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    cancellation_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.getCancellationById(req, res);

            expect(stub).calledOnceWith(ID);

            expect(statusSpy).calledOnceWith(400);

            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("list cancellations by event_id", () => {
        it("should run service procedure and send status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.listCancellationsByEventId(
                req,
                res
            );

            expect(stub).calledOnceWith(ID);

            expect(statusSpy).calledOnceWith(200);

            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedurer and send status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "listByEventId")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    event_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.listCancellationsByEventId(
                req,
                res
            );

            expect(stub).calledOnceWith(ID);

            expect(statusSpy).calledOnceWith(400);

            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("create cancellation", () => {
        it("should run service procedure and send status 201", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "create")
                .resolves(RESOLVED(200));
            let req = createRequest({
                body: DATA,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.createCancellation(req, res);

            expect(stub).calledOnceWith(DATA);
            expect(statusSpy).calledOnceWith(200);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure and send status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "create")
                .resolves(FAILED(400));
            let req = createRequest({
                body: DATA,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.createCancellation(req, res);

            expect(stub).calledOnceWith(DATA);
            expect(statusSpy).calledOnceWith(400);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("put", () => {
        const BODY = Object.assign({}, { cancellation_id: ID }, DATA);
        it("should run service procedure and send status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "putById")
                .resolves(RESOLVED(200));
            let req = createRequest({
                body: BODY,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.put(req, res);

            expect(stub).calledOnceWith(BODY.cancellation_id, BODY);
            expect(statusSpy).calledOnceWith(200);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure and send status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "putById")
                .resolves(FAILED(400));
            let req = createRequest({
                body: BODY,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.put(req, res);

            expect(stub).calledOnceWith(BODY.cancellation_id, BODY);
            expect(statusSpy).calledOnceWith(400);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("patch", () => {
        const BODY = Object.assign({}, { cancellation_id: ID }, DATA);
        it("should run service procedure and send status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "patchById")
                .resolves(RESOLVED(200));
            let req = createRequest({
                body: BODY,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.patch(req, res);

            expect(stub).calledOnceWith(BODY.cancellation_id, BODY);
            expect(statusSpy).calledOnceWith(200);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure and send status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "patchById")
                .resolves(FAILED(400));
            let req = createRequest({
                body: BODY,
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.patch(req, res);

            expect(stub).calledOnceWith(BODY.cancellation_id, BODY);
            expect(statusSpy).calledOnceWith(400);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });

    describe("remove cancellation", () => {
        it("should run service procedure and send status 200", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "deleteById")
                .resolves(RESOLVED(200));
            let req = createRequest({
                body: {
                    cancellation_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.removeCancellation(req, res);

            expect(stub).calledOnceWith(ID);
            expect(statusSpy).calledOnceWith(200);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run service procedure adn send status 400", async () => {
            stub = sinon
                .stub(EventCancellationService.prototype, "deleteById")
                .resolves(FAILED(400));
            let req = createRequest({
                body: {
                    cancellation_id: ID,
                },
            });
            let res = createResponse();
            let statusSpy = sinon.spy(res, "status");

            const result = await controller.removeCancellation(req, res);

            expect(stub).calledOnceWith(ID);
            expect(statusSpy).calledOnceWith(400);
            expect(res._getData()).to.eql(FAILED(400));
        });
    });
});
