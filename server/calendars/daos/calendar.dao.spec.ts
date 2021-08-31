import sinon, { SinonSandbox, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import CalendarDao from "./calendar.dao";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import * as messageService from "../../common/services/message/message.service";
chai.use(sinonChai);
let queryStub = sinon.stub();
const SUCCESS: ServerResponsePayload = {
    message: "Successfully created calendar",
    success: true,
    data: [],
    statusCode: 200,
};
const FAILED: ServerResponsePayload = {
    message: "failed",
    success: false,
    error: new Error(),
    statusCode: 500,
};
const ERROR = new Error("Fake Error");
const CALENDAR_DATA = { name: "My Test Calendar" };
const CALENDAR_ID = "1";
let spySuccess = sinon.spy(messageService, "sendSuccess");
let spyFailure = sinon.spy(messageService, "sendFailure");
describe("CalendarDao", function () {
    let CalendarDao = proxyquire("./calendar.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    const calendarDao: CalendarDao = new CalendarDao();

    beforeEach(() => {
        queryStub.resolves({ rows: [] });
    });
    afterEach(() => {
        sinon.reset();
        spySuccess.resetHistory();
        queryStub.reset();
        spyFailure.resetHistory();
    });

    describe("property:tableName", () => {
        it("should equal ts.calendars", function () {
            expect(calendarDao["tableName"]).equals("ts.calendars");
        });
    });

    describe("adding a calendar", () => {
        const sql = `INSERT INTO "ts.calendars" (name) VALUES ($1)`;
        it("should run with correct parameters and return SuccessPayload", async () => {
            await calendarDao.addCalendar(CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [CALENDAR_DATA.name]);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(SUCCESS.message, SUCCESS.data, 201);
        });

        it("should return error with status 500", async () => {
            const error = new Error("Fake Error");
            queryStub.throws(error);
            await calendarDao.addCalendar(CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [CALENDAR_DATA.name]);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(error.message, error, 500);
        });
    });

    describe("getting calendars", () => {
        it("should get all calendars", async () => {
            const sql = `SELECT * FROM "ts.calendars"`;

            await calendarDao.getCalendars();

            expect(queryStub).calledWith(sql, []);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved calendars",
                SUCCESS.data
            );
        });

        it("should return error with status 500", async () => {
            const sql = `SELECT * FROM "ts.calendars"`;
            queryStub.throws(ERROR);
            await calendarDao.getCalendars();

            expect(queryStub).calledWith(sql, []);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });

        it("should retrieve a calendar by id", async () => {
            const sql = `SELECT * FROM "ts.calendars" WHERE calendar_id = $1`;
            queryStub.resolves({ rows: [1] });
            await calendarDao.getCalendarById(CALENDAR_ID);

            expect(queryStub).calledWith(sql, [CALENDAR_ID]);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved calendar",
                1,
                200
            );
        });

        it("should throw 404 error when rows is empty", async () => {
            const sql = `SELECT * FROM "ts.calendars" WHERE calendar_id = $1`;
            queryStub.resolves({ rows: [] });
            await calendarDao.getCalendarById(CALENDAR_ID);

            expect(queryStub).calledWith(sql, [CALENDAR_ID]);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).to.be.calledWithMatch(
                `No calendar found with id: ${CALENDAR_ID}`
            );
        });

        it("should return error with status code 500", async () => {
            const sql = `SELECT * FROM "ts.calendars" WHERE calendar_id = $1`;
            queryStub.throws(ERROR);
            await calendarDao.getCalendarById(CALENDAR_ID);

            expect(queryStub).calledWith(sql, [CALENDAR_ID]);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("put calendar update", () => {
        it("should successfully update calendar", async () => {
            const sql = `UPDATE "ts.calendars" SET name = $2 WHERE calendar_id = $1`;

            await calendarDao.putCalendarById(CALENDAR_ID, CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [
                CALENDAR_ID,
                CALENDAR_DATA.name,
            ]);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated calendar id: 1",
                Object.assign(CALENDAR_DATA, { calendar_id: CALENDAR_ID })
            );
        });

        it("should return error with status code 500", async () => {
            const sql = `UPDATE "ts.calendars" SET name = $2 WHERE calendar_id = $1`;

            queryStub.throws(ERROR);
            await calendarDao.putCalendarById(CALENDAR_ID, CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [
                CALENDAR_ID,
                CALENDAR_DATA.name,
            ]);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("patch calendar update", () => {
        it("should successfully update calendar", async () => {
            const sql = `UPDATE "ts.calendars" SET name = $2 WHERE calendar_id = $1`;

            await calendarDao.patchCalendarById(CALENDAR_ID, CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [
                CALENDAR_ID,
                CALENDAR_DATA.name,
            ]);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated calendar id: 1",
                Object.assign(CALENDAR_DATA, { calendar_id: CALENDAR_ID })
            );
        });

        it("should return error with status code 500", async () => {
            const sql = `UPDATE "ts.calendars" SET name = $2 WHERE calendar_id = $1`;

            queryStub.throws(ERROR);
            await calendarDao.patchCalendarById(CALENDAR_ID, CALENDAR_DATA);

            expect(queryStub).calledWith(sql, [
                CALENDAR_ID,
                CALENDAR_DATA.name,
            ]);
            expect(queryStub).calledOnce;
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("remove calendar", () => {
        it("should successfully remove calendar and send success response", async () => {
            const sql = `DELETE FROM "ts.calendars" WHERE calendar_id = $1`;

            await calendarDao.removeCalendarById(CALENDAR_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [CALENDAR_ID]);
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith("Successfully removed calendar", []);
        });

        it("should return an error response with status 500", async () => {
            const sql = `DELETE FROM "ts.calendars" WHERE calendar_id = $1`;
            queryStub.throws(ERROR);
            await calendarDao.removeCalendarById(CALENDAR_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [CALENDAR_ID]);
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR);
        });
    });
});
