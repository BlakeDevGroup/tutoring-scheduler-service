import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import CancellationService from "./cancellation.service";
import CancellationDao from "../daos/cancellation.dao";

let cancellationService: CancellationService;
let cancellationDaoStub: SinonStub;

const CANCELLATION_DATA = {
    amount: 45,
    reason: "Reason here",
    id: 1,
    source: "event",
    excluded_dates: ["2021-09-13T10:30-2021-09-13T11:30"],
};

const CANCELLATION_ID = "1";

describe("CancellationService", () => {
    beforeEach(() => {
        cancellationService = new CancellationService();
        cancellationDaoStub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        cancellationDaoStub.reset();
    });

    describe("create a cancellation", () => {
        it("should run dao procedure with proper resource", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "addCancellation"
            );

            await cancellationService.create(CANCELLATION_DATA);

            expect(cancellationDaoStub).calledOnce;
            expect(cancellationDaoStub).calledWith(CANCELLATION_DATA);
        });
    });

    describe("delete a cancellation", () => {
        it("should run dao procedure with proper resource", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "removeCancellationById"
            );

            await cancellationService.deleteById(CANCELLATION_ID);

            expect(cancellationDaoStub).calledOnceWith(CANCELLATION_ID);
        });
    });

    describe("list cancellations", () => {
        it("should run dao procedure with proper resource", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "getCancellations"
            );

            await cancellationService.list(100, 0);

            expect(cancellationDaoStub).calledOnceWith();
        });
    });

    describe("update series", () => {
        it("should run patch dao procedure with proper resource", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "patchCancellationById"
            );

            await cancellationService.patchById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(cancellationDaoStub).calledOnceWith(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );
        });

        it("should run put dao procedure with proper resource", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "putCancellationById"
            );

            await cancellationService.putById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(cancellationDaoStub).calledOnceWith(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );
        });
    });

    describe("get a series", () => {
        it("should run get dao procedure with proper args", async () => {
            cancellationDaoStub = sinon.stub(
                CancellationDao.prototype,
                "getCancellationById"
            );

            await cancellationService.readById(CANCELLATION_ID);

            expect(cancellationDaoStub).calledOnceWith(CANCELLATION_ID);
        });
    });
});
