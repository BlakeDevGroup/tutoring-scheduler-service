import sinon, { SinonSpy, SinonStub, SinonSandbox, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import CancellationDao from "./cancellation.dao";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import * as messageService from "../../common/services/message/message.service";
import { query } from "winston";
chai.use(sinonChai);

const CANCELLATION_DATA = {
    amount: 50.0,
    reason: "reason",
    event_id: 1,
    source: "event",
    id: 1,
    excluded_dates: ["2021-09-13T10:30-2021-09-13T11:30"],
};

const CANCELLATION_RETURN_VALUE = { rows: [{}] };
const FAILED_ERROR = new Error("Failed");
const CANCELLATION_ID = "1";

let queryStub: SinonStub = sinon.stub();
let spySuccess: SinonSpy;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;

describe("CancellationDao", () => {
    let CancellationDao = proxyquire("./cancellation.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    let cancellationDao: CancellationDao = new CancellationDao();
    before(() => {
        sandBox = sinon.createSandbox();
        spySuccess = sandBox.spy(messageService, "sendSuccess");
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });

    after(() => {
        sandBox.restore();
    });

    beforeEach(() => {
        queryStub.resolves(CANCELLATION_RETURN_VALUE);
    });

    afterEach(() => {
        queryStub.reset();
        spySuccess.resetHistory();
        spyFailure.resetHistory();
    });

    it("tablename should equal ts.cancellations", () => {
        expect(cancellationDao["tableName"]).equals("ts.cancellations");
    });

    describe("add a cancellation", () => {
        const sql = `INSERT INTO "ts.cancellations" (amount, reason, source, id, excluded_dates) VALUES ($1, $2, $3, $4, $5)`;

        it("should send success message and run with proper arguments", async () => {
            await cancellationDao.addCancellation(CANCELLATION_DATA);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                CANCELLATION_DATA.amount,
                CANCELLATION_DATA.reason,
                CANCELLATION_DATA.source,
                CANCELLATION_DATA.id,
                CANCELLATION_DATA.excluded_dates,
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully created cancellation",
                [],
                201
            );
        });

        it("should catch error and send failure ", async () => {
            queryStub.throws(FAILED_ERROR);

            await cancellationDao.addCancellation(CANCELLATION_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("get all cancellations", () => {
        it("should send success message and run with proper arguments", async () => {
            const sql = `SELECT * FROM "ts.cancellations"`;

            await cancellationDao.getCancellations();

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, []);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved cancellations",
                CANCELLATION_RETURN_VALUE.rows
            );
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(FAILED_ERROR);
            await cancellationDao.getCancellations();

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("get a cancellation", () => {
        it("should send success message and run with proper arguments", async () => {
            const sql = `SELECT * FROM "ts.cancellations" WHERE cancellation_id = $1`;

            await cancellationDao.getCancellationById(CANCELLATION_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [CANCELLATION_ID]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved cancellation",
                CANCELLATION_RETURN_VALUE.rows[0]
            );
        });

        it("should send failure message and status 404 when rows is empty", async () => {
            queryStub.resolves({ rows: [] });
            await cancellationDao.getCancellationById(CANCELLATION_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure.args[0][0]).equal(
                `No cancellation found with id: ${CANCELLATION_ID}`
            );
            expect(spyFailure.args[0][2]).equal(404);
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(FAILED_ERROR);

            await cancellationDao.getCancellationById(CANCELLATION_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("update a cancellation", () => {
        it("should send success message and run with proper arguments", async () => {
            const sql = `UPDATE "ts.cancellations" SET amount = $2, reason = $3, source = $4, id = $5, excluded_dates = $6 WHERE cancellation_id = $1`;

            await cancellationDao.putCancellationById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                CANCELLATION_ID,
                CANCELLATION_DATA.amount,
                CANCELLATION_DATA.reason,
                CANCELLATION_DATA.source,
                CANCELLATION_DATA.id,
                CANCELLATION_DATA.excluded_dates,
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: CANCELLATION_ID },
                    CANCELLATION_DATA
                )
            );
        });

        it("should catch error and send failure message", async () => {
            queryStub.throws(FAILED_ERROR);
            await cancellationDao.putCancellationById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(FAILED_ERROR.message, FAILED_ERROR);
        });

        it("should send success message and run with proper arguments", async () => {
            const sql = `UPDATE "ts.cancellations" SET amount = $2, reason = $3, source = $4, id = $5, excluded_dates = $6 WHERE cancellation_id = $1`;

            await cancellationDao.patchCancellationById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                CANCELLATION_ID,
                CANCELLATION_DATA.amount,
                CANCELLATION_DATA.reason,
                CANCELLATION_DATA.source,
                CANCELLATION_DATA.id,
                CANCELLATION_DATA.excluded_dates,
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: CANCELLATION_ID },
                    CANCELLATION_DATA
                )
            );
        });

        it("should catch error and send failure message", async () => {
            queryStub.throws(FAILED_ERROR);
            await cancellationDao.patchCancellationById(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(FAILED_ERROR.message, FAILED_ERROR);
        });
    });

    describe("remove a cancellation", () => {
        it("should send success message and run with proper arguments", async () => {
            const sql = `DELETE FROM "ts.cancellations" WHERE cancellation_id = $1`;
            await cancellationDao.removeCancellationById(CANCELLATION_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [CANCELLATION_ID]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith("Successfully removed cancellation");
        });

        it("should send failure with status 500", async () => {
            queryStub.throws(FAILED_ERROR);
            await cancellationDao.removeCancellationById(CANCELLATION_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });
});
