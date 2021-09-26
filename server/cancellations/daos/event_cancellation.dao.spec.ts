import sinon, { SinonSpy, SinonStub, SinonSandbox, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import EventCancellationDao from "./event_cancellation.dao";
import * as messageService from "../../common/services/message/message.service";
import { query } from "winston";
chai.use(sinonChai);

const CANCELLATION_DATA = {
    event_id: "1",
    reason: "Reason",
};

const CANCELLATION_RETURN_VALUE = { rows: [CANCELLATION_DATA] };
const ERROR = new Error("Failed");
const CANCELLATION_ID = "1";
const EVENT_ID = "1";

let queryStub: SinonStub = sinon.stub();
let spySuccess: SinonSpy;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;

describe("EventCancellationDao", () => {
    let EventCancellationDao = proxyquire("./event_cancellation.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;

    let eventCancellationDao: EventCancellationDao = new EventCancellationDao();

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

    it("tablename should equal ts.event_cancellations", () => {
        expect(eventCancellationDao["tableName"]).equals(
            "ts.event_cancellations"
        );
    });

    describe("get cancellations", () => {
        const SQL = `SELECT * FROM "ts.event_cancellations"`;
        it("should catch error and send failure with status 500", async () => {
            queryStub.throws(ERROR);
            const result = await eventCancellationDao.getCancellations();

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });

        it("should run procedure with proper args and send success", async () => {
            const result = await eventCancellationDao.getCancellations();

            expect(spySuccess).calledOnceWith(
                "Successfully retrieved event cancellations",
                CANCELLATION_RETURN_VALUE.rows
            );

            expect(queryStub).calledOnceWith(SQL, []);
        });
    });

    describe("get a cancellation by id", () => {
        const SQL = `SELECT * FROM "ts.event_cancellations" WHERE cancellation_id = $1`;

        it("should catch error and send failure with status 500", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.getCancellationById(CANCELLATION_ID);

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });

        it("should run procedure with proper args and send success", async () => {
            await eventCancellationDao.getCancellationById(CANCELLATION_ID);

            expect(queryStub).calledOnceWith(SQL, [CANCELLATION_ID]);

            expect(spySuccess).calledOnceWith(
                "Successfully retrieved event cancellation",
                CANCELLATION_RETURN_VALUE.rows[0]
            );
        });

        it("should send failure when data is empty", async () => {
            queryStub.resolves({ rows: [] });
            const error = new Error(
                `No event cancellation found with id: ${CANCELLATION_ID}`
            );
            await eventCancellationDao.getCancellationById(CANCELLATION_ID);

            expect(queryStub).calledOnceWith(SQL, [CANCELLATION_ID]);

            expect(spyFailure.args[0][0]).equals(
                `No event cancellation found with id: ${CANCELLATION_ID}`
            );

            expect(spyFailure.args[0][2]).equals(404);
        });
    });

    describe("get cancellations by event id", () => {
        const SQL = `SELECT * FROM "ts.event_cancellations" WHERE event_id = $1`;
        it("should run procedure with proper args and send success", async () => {
            await eventCancellationDao.getCancellationsByEventId(EVENT_ID);

            expect(queryStub).calledOnceWith(SQL, [EVENT_ID]);

            expect(spySuccess).calledOnceWith(
                "Successfully retrieved event cancellations",
                CANCELLATION_RETURN_VALUE.rows
            );
        });

        it("should send failure when data is empty", async () => {
            queryStub.resolves({ rows: [] });

            await eventCancellationDao.getCancellationsByEventId(EVENT_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure.args[0][0]).to.equal(
                `No cancellation associated with event_id: ${EVENT_ID}`
            );
            expect(spyFailure.args[0][2]).to.equal(404);
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.getCancellationsByEventId(EVENT_ID);

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });
    });

    describe("create cancellation", () => {
        it("should send success and run procedure with proper args", async () => {
            const SQL = `INSERT INTO "ts.event_cancellations" (event_id, reason) VALUES ($1, $2)`;
            await eventCancellationDao.createEventCancellation(
                CANCELLATION_DATA
            );

            expect(queryStub).calledOnceWith(SQL, [
                CANCELLATION_DATA.event_id,
                CANCELLATION_DATA.reason,
            ]);

            expect(spySuccess).calledOnceWith(
                "Successfully created event cancellation",
                [],
                201
            );
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.createEventCancellation(
                CANCELLATION_DATA
            );

            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("update a  cancellation", () => {
        const SQL = `UPDATE "ts.event_cancellations" SET event_id = $2, reason = $3 WHERE cancellation_id = $1`;
        it("should run put procedure and send success", async () => {
            await eventCancellationDao.putEventCancellation(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(queryStub).calledOnceWith(SQL, [
                CANCELLATION_ID,
                CANCELLATION_DATA.event_id,
                CANCELLATION_DATA.reason,
            ]);

            expect(spySuccess).calledOnceWith(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: CANCELLATION_ID },
                    CANCELLATION_DATA
                )
            );
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.putEventCancellation(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });

        it("should run patch procedure and send success", async () => {
            await eventCancellationDao.patchEventCancellation(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(queryStub).calledOnceWith(SQL, [
                CANCELLATION_ID,
                CANCELLATION_DATA.event_id,
                CANCELLATION_DATA.reason,
            ]);

            expect(spySuccess).calledOnceWith(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: CANCELLATION_ID },
                    CANCELLATION_DATA
                )
            );
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.patchEventCancellation(
                CANCELLATION_ID,
                CANCELLATION_DATA
            );

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });
    });

    describe("remove a cancellation", () => {
        const SQL = `DELETE FROM "ts.event_cancellations" WHERE cancellation_id = $1`;
        it("should run procedure with proper arguments and send success", async () => {
            await eventCancellationDao.deleteEventCancellation(CANCELLATION_ID);

            expect(queryStub).calledOnceWith(SQL, [CANCELLATION_ID]);

            expect(spySuccess).calledOnceWith(
                "Successfully removed event cancellation",
                []
            );
        });

        it("should catch error and send failure", async () => {
            queryStub.throws(ERROR);

            await eventCancellationDao.deleteEventCancellation(CANCELLATION_ID);

            expect(spyFailure).calledOnceWith(ERROR.message, ERROR, 500);
        });
    });
});
