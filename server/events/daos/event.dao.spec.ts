import sinon, { SinonSandbox, SinonStub, SinonSpy, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import * as messageService from "../../common/services/message/message.service";
import EventDao from "./event.dao";
import { query } from "winston";
chai.use(sinonChai);

const CREATED_EVENTS_LIST = {
    rows: [
        {
            date_end: "2021-07-29 15:30:00",
            date_start: "2021-07-29 14:30:00",
            title: "Our First Event",
            all_day: true,
            user_id: 1,
            calendar_id: 1,
            description: "Test Description",
            company_id: 1,
        },
    ],
};

const EMPTY_EVENTS_LIST = {
    rows: [],
};

const FAILED_ERROR = new Error("Failed Error");

const EVENT_STRING: string =
    'INSERT INTO "ts.events" (date_start, date_end, title, all_day, calendar_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)';
let queryStub: SinonStub = sinon.stub();
let spySuccess: SinonSpy;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;
describe("EventDao", function () {
    let EventDao = proxyquire("./event.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    const eventDao: EventDao = new EventDao();
    before(() => {
        sandBox = sinon.createSandbox();
        spySuccess = sandBox.spy(messageService, "sendSuccess");
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });
    after(() => {
        sandBox.restore();
    });
    beforeEach(() => {
        queryStub.resolves(CREATED_EVENTS_LIST);
    });
    afterEach(() => {
        queryStub.reset();
        spySuccess.resetHistory();
        spyFailure.resetHistory();
    });
    describe("property:tableName", function () {
        it("should equal ts.events", function () {
            expect(eventDao["tableName"]).is.equal("ts.events");
        });
    });

    describe("method:addEvent", () => {
        const EVENT_STRING: string = `INSERT INTO "ts.events" (date_start, date_end, title, all_day, calendar_id, user_id, description, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id`;
        it("should run with correct parameters and run query only once", async () => {
            queryStub.resolves({ rows: [{ event_id: "1" }] });

            await eventDao.addEvent({
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
                description: CREATED_EVENTS_LIST.rows[0].description,
                company_id: CREATED_EVENTS_LIST.rows[0].company_id,
            });

            expect(queryStub).calledWith(EVENT_STRING, [
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
                CREATED_EVENTS_LIST.rows[0].user_id,
                CREATED_EVENTS_LIST.rows[0].description,
                CREATED_EVENTS_LIST.rows[0].company_id,
            ]);

            expect(queryStub).calledOnce;
        });
    });

    describe("method:getEvents", () => {
        it("should run with correct parameters and run query only once", async () => {
            queryStub.returns(CREATED_EVENTS_LIST);

            await eventDao.getEvents();

            expect(queryStub).calledWith(
                `SELECT * FROM "ts.events" WHERE calendar_id = $1`,
                []
            );

            expect(queryStub).calledOnce;

            expect(queryStub).to.have.returned(CREATED_EVENTS_LIST);
        });
    });

    describe("method:getEventsByCalendarId", () => {
        it("should retrieve event specified by calendar_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE calendar_id = $1`;
            const calendarId = "1";
            queryStub.withArgs(sql, [calendarId]).returns(CREATED_EVENTS_LIST);

            await eventDao.getEventsByCalendarId(calendarId);

            expect(queryStub).calledWith(sql, [calendarId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(CREATED_EVENTS_LIST);
        });

        it("should retrieve empty array because no event with associated calendar_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE calendar_id = $1`;
            const calendarId = "2";
            queryStub.withArgs(sql, [1]).returns(CREATED_EVENTS_LIST);
            queryStub.withArgs(sql, [calendarId]).returns(EMPTY_EVENTS_LIST);

            await eventDao.getEventsByCalendarId(calendarId);

            expect(queryStub).calledWith(sql, [calendarId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:getEventById", () => {
        it("should retreive event by specified event_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE event_id = $1`;
            const eventId = "1";
            queryStub.withArgs(sql, [eventId]);

            await eventDao.getEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;
        });

        it("should retreive empty array as no event with event_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE event_id = $1`;
            const eventId = "2";
            queryStub.withArgs(sql, [1]).returns(CREATED_EVENTS_LIST);
            queryStub.withArgs(sql, [2]).returns(EMPTY_EVENTS_LIST);
            await eventDao.getEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;
        });
    });

    describe("method:putEventById", () => {
        it("should put change to event and return empty array", async () => {
            const sql = `UPDATE "ts.events" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6, description = $8, company_id = $9 WHERE calendar_id = $7 and event_id = $1`;
            const eventId = "1";
            const event = [
                eventId,
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].user_id,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
                CREATED_EVENTS_LIST.rows[0].description,
                CREATED_EVENTS_LIST.rows[0].company_id,
            ];

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.putEventById(eventId, {
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
                description: CREATED_EVENTS_LIST.rows[0].description,
                company_id: CREATED_EVENTS_LIST.rows[0].company_id,
            });

            expect(queryStub).calledWith(sql, event);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:patchEventById", () => {
        it("should patch change to event and return empty array", async () => {
            const sql = `UPDATE "ts.events" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6, description = $8, company_id = $9 WHERE calendar_id = $7 and event_id = $1`;
            const eventId = "1";
            const event = [
                eventId,
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].user_id,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
                CREATED_EVENTS_LIST.rows[0].description,
                CREATED_EVENTS_LIST.rows[0].company_id,
            ];

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.patchEventById(eventId, {
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
                description: CREATED_EVENTS_LIST.rows[0].description,
                company_id: CREATED_EVENTS_LIST.rows[0].company_id,
            });

            expect(queryStub).calledWith(sql, event);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:removeEventById", () => {
        it("should remove event and return empty array", async () => {
            const sql = `DELETE FROM "ts.events" WHERE event_id = $1`;
            const eventId = "1";

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.removeEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("get event by event_id and calendar_id", () => {
        const EVENT_ID = "1";
        const CALENDAR_ID = "1";
        const sql = `SELECT * FROM "ts.events" WHERE event_id = $1 and calendar_id = $2`;

        it("should sendFailure and status 404 if event_id does not exist on calendar_id", async () => {
            queryStub.resolves({ rows: [] });
            await eventDao.getEventByCalendarId(EVENT_ID, CALENDAR_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [EVENT_ID, CALENDAR_ID]);

            expect(spyFailure).calledOnce;

            expect(spyFailure.args[0][0]).to.equal(
                `Event with id: ${EVENT_ID} does not exist on calendar with id: ${CALENDAR_ID}`
            );

            expect(spyFailure.args[0][2]).to.equal(404);
        });

        it("should handle error, sendFailure and status 500", async () => {
            queryStub.throws(FAILED_ERROR);
            await eventDao.getEventByCalendarId(EVENT_ID, CALENDAR_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });

        it("should call sensuccess with proper args and status 200", async () => {
            await eventDao.getEventByCalendarId(EVENT_ID, CALENDAR_ID);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved event",
                CREATED_EVENTS_LIST.rows[0]
            );
        });
    });
});
