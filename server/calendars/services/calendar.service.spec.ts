import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import sinonChai from "sinon-chai";
import CalendarService from "./calendar.service";
import CalendarDao from "../daos/calendar.dao";
let calendarDao: CalendarDao;
let calendarService: CalendarService;
let calendarDaoStub: SinonStub = sinon.stub();
const RESOLVED = {
    success: true,
    message: "PROCESS RESOLVED",
    statusCode: 200,
};
const CALENDAR_DATA = { name: "My Calendar" };
const CALENDAR_ID = "1";
describe("EventService", () => {
    beforeEach(() => {
        calendarDao = new CalendarDao();
        calendarService = new CalendarService();
    });
    afterEach(() => {
        sinon.reset();
        calendarDaoStub.reset();
    });

    describe("create calendar", () => {
        it("should run addCalendar with proper resource", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "addCalendar")
                .resolves(RESOLVED);

            const result = await calendarService.create(CALENDAR_DATA);

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith(CALENDAR_DATA);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("delete calendar", () => {
        it("should run deleteCalendar with proper id", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "removeCalendarById")
                .resolves(RESOLVED);

            const result = await calendarService.deleteById(CALENDAR_ID);

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith(CALENDAR_ID);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("list all calendars", () => {
        it("should run lists", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "getCalendars")
                .resolves(RESOLVED);
            const result = await calendarService.list(100, 0);

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith();
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("patch calendar", () => {
        it("should patch calendar by id", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "patchCalendarById")
                .resolves(RESOLVED);

            const result = await calendarService.patchById(
                CALENDAR_ID,
                CALENDAR_DATA
            );

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith(CALENDAR_ID, CALENDAR_DATA);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("put calendar", () => {
        it("should put calendar by id", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "putCalendarById")
                .resolves(RESOLVED);

            const result = await calendarService.putById(
                CALENDAR_ID,
                CALENDAR_DATA
            );

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith(CALENDAR_ID, CALENDAR_DATA);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("read a single calendar", () => {
        it("should read calendar by id", async () => {
            calendarDaoStub = sinon
                .stub(CalendarDao.prototype, "getCalendarById")
                .resolves(RESOLVED);

            const result = await calendarService.readById(CALENDAR_ID);

            expect(calendarDaoStub).calledOnce;
            expect(calendarDaoStub).calledWith(CALENDAR_ID);
            expect(result).to.equal(RESOLVED);
        });
    });
});
