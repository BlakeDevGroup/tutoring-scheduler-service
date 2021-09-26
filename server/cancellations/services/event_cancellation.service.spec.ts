import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import EventCancellationService from "./event_cancellation.service";
import EventCancellationDao from "../daos/event_cancellation.dao";

let eventCancellationService: EventCancellationService;
let stub: SinonStub;

const CANCELLATION_DATA = {
    event_id: "1",
    reason: "reason",
};

const CANCELLATION_ID = "1";
const EVENT_ID = "1";

describe("EventCancellationService", () => {
    beforeEach(() => {
        eventCancellationService = new EventCancellationService();
        stub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        stub.reset();
    });

    describe("get all event cancelations", () => {
        it("should run dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "getCancellations"
            );

            await eventCancellationService.list(100, 0);

            expect(stub).calledOnceWith();
        });
    });

    describe("get cancellation by id", () => {
        it("should run dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "getCancellationById"
            );

            await eventCancellationService.getById(CANCELLATION_ID);

            expect(stub).calledOnceWith(CANCELLATION_ID);
        });
    });

    describe("get cancellation by event_id", () => {
        it("should run dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "getCancellationsByEventId"
            );

            await eventCancellationService.listByEventId(EVENT_ID);

            expect(stub).calledOnceWith(EVENT_ID);
        });
    });

    describe("update cancellation", () => {
        it("should run put dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "putEventCancellation"
            );

            await eventCancellationService.putById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(stub).calledOnceWith(CANCELLATION_ID, CANCELLATION_DATA);
        });

        it("should run patch dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "patchEventCancellation"
            );

            await eventCancellationService.patchById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(stub).calledOnceWith(CANCELLATION_ID, CANCELLATION_DATA);
        });
    });

    describe("remove a cancellation", () => {
        it("should run dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "deleteEventCancellation"
            );

            await eventCancellationService.deleteById(CANCELLATION_ID);

            expect(stub).calledOnceWith(CANCELLATION_ID);
        });
    });

    describe("create a cancellation", () => {
        it("should run dao procedure with proper arguments", async () => {
            stub = sinon.stub(
                EventCancellationDao.prototype,
                "createEventCancellation"
            );

            await eventCancellationService.create(CANCELLATION_DATA);

            expect(stub).calledOnceWith(CANCELLATION_DATA);
        });
    });
});
