import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import EventService from "./event.service";
import EventDao from "../daos/event.dao";

chai.use(sinonChai);
const RESOLVED_STATEMENT = "resolved";
const EVENT_ID: string = "1";
const EVENT_ARG = {
    dateStart: "08-25-2021",
    dateEnd: "08-26-2021",
    title: "Example Argument",
    allDay: true,
    calendarId: 1,
    userId: 1,
};
describe("EventService", () => {
    let eventDaoStub: SinonStub = sinon.stub();
    let eventService: EventService;
    beforeEach(() => {
        eventService = new EventService();
    });
    afterEach(() => {
        sinon.restore();
        eventDaoStub.reset();
    });
    describe("method:create", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "addEvent")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.create(EVENT_ARG);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ARG);
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:deleteById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "removeEventById")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.deleteById(EVENT_ID);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ID);
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:list", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEvents")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.list(100, 1);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:patchById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "patchEventById")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.patchById(EVENT_ID, EVENT_ARG);
            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:putById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "putEventById")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.putById(EVENT_ID, EVENT_ARG);
            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:readById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEventById")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.readById(EVENT_ID);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ID);
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });

    describe("method:listByCalendarId", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEventsByCalendarId")
                .resolves(RESOLVED_STATEMENT);

            const result = await eventService.listByCalendarId(
                parseInt(EVENT_ID),
                100,
                10
            );

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(parseInt(EVENT_ID));
            expect(result).to.equal(RESOLVED_STATEMENT);
        });
    });
});
