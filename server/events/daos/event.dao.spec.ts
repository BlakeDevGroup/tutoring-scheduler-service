import sinon, { SinonSandbox, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import { query } from "express";

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
        },
    ],
};

const EMPTY_EVENTS_LIST = {
    rows: [],
};

const EVENT_STRING: string =
    'INSERT INTO "ts.events" (date_start, date_end, title, all_day, calendar_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)';
let queryStub = sinon.stub();
queryStub.returns(CREATED_EVENTS_LIST);

describe("EventDao", function () {
    let EventDao = proxyquire("./event.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    let sandbox: SinonSandbox;
    const eventDao = new EventDao();
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
        queryStub.reset();
    });
    describe("property:tableName", function () {
        it("should equal ts.events", function () {
            expect(eventDao["tableName"]).is.equal("ts.events");
        });
    });

    describe("method:addEvent", () => {
        it("should run with correct parameters and run query only once", async () => {
            await eventDao.addEvent({
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
            });

            expect(queryStub).calledWith(EVENT_STRING, [
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
                CREATED_EVENTS_LIST.rows[0].user_id,
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
            const calendarId = 1;
            queryStub.withArgs(sql, [calendarId]).returns(CREATED_EVENTS_LIST);

            await eventDao.getEventsByCalendarId(calendarId);

            expect(queryStub).calledWith(sql, [calendarId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(CREATED_EVENTS_LIST);
        });

        it("should retrieve empty array because no event with associated calendar_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE calendar_id = $1`;
            const calendarId = 2;
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
            const eventId = 1;
            queryStub.withArgs(sql, [1]).returns(CREATED_EVENTS_LIST);

            await eventDao.getEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(CREATED_EVENTS_LIST);
        });

        it("should retreive empty array as no event with event_id", async () => {
            const sql = `SELECT * FROM "ts.events" WHERE event_id = $1`;
            const eventId = 2;
            queryStub.withArgs(sql, [1]).returns(CREATED_EVENTS_LIST);
            queryStub.withArgs(sql, [2]).returns(EMPTY_EVENTS_LIST);
            await eventDao.getEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:putEventById", () => {
        it("should put change to event and return empty array", async () => {
            const sql = `UPDATE "ts.events" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6 WHERE calendar_id = $7 and event_id = $1`;
            const eventId = 1;
            const event = [
                eventId,
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].user_id,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
            ];

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.putEventById(eventId, {
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
            });

            expect(queryStub).calledWith(sql, event);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:patchEventById", () => {
        it("should patch change to event and return empty array", async () => {
            const sql = `UPDATE "ts.events" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6 WHERE calendar_id = $7 and event_id = $1`;
            const eventId = 1;
            const event = [
                eventId,
                CREATED_EVENTS_LIST.rows[0].date_start,
                CREATED_EVENTS_LIST.rows[0].date_end,
                CREATED_EVENTS_LIST.rows[0].title,
                CREATED_EVENTS_LIST.rows[0].all_day,
                CREATED_EVENTS_LIST.rows[0].user_id,
                CREATED_EVENTS_LIST.rows[0].calendar_id,
            ];

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.patchEventById(eventId, {
                date_start: CREATED_EVENTS_LIST.rows[0].date_start,
                date_end: CREATED_EVENTS_LIST.rows[0].date_end,
                title: CREATED_EVENTS_LIST.rows[0].title,
                all_day: CREATED_EVENTS_LIST.rows[0].all_day,
                user_id: CREATED_EVENTS_LIST.rows[0].user_id,
                calendar_id: CREATED_EVENTS_LIST.rows[0].calendar_id,
            });

            expect(queryStub).calledWith(sql, event);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });

    describe("method:removeEventById", () => {
        it("should remove event and return empty array", async () => {
            const sql = `DELETE FROM "ts.events" WHERE event_id = $1`;
            const eventId = 1;

            queryStub.returns(EMPTY_EVENTS_LIST);

            await eventDao.removeEventById(eventId);

            expect(queryStub).calledWith(sql, [eventId]);

            expect(queryStub).calledOnce;

            expect(queryStub).returned(EMPTY_EVENTS_LIST);
        });
    });
});
