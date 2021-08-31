import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import EventService from "./event.service";
import EventDao from "../daos/event.dao";
import { CreateEventDto } from "../dtos/create.event.dto";

chai.use(sinonChai);
const RESOLVED = {
    success: true,
    message: "PROCESS RESOLVED",
    statusCode: 200,
};
const EVENT_ID: string = "1";
const EVENT_ARG = {
    date_start: "08-25-2021",
    date_end: "08-26-2021",
    title: "Example Argument",
    all_day: true,
    calendar_id: 1,
    user_id: 1,
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
                .resolves(RESOLVED);
            type EventResponse = {
                message: string;
                success: boolean;
                data?: CreateEventDto;
                error?: Error;
            };
            const result: EventResponse = await eventService.create(EVENT_ARG);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ARG);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:deleteById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "removeEventById")
                .resolves(RESOLVED);

            const result = await eventService.deleteById(EVENT_ID);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ID);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:list", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEvents")
                .resolves(RESOLVED);

            const result = await eventService.list(100, 1);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:patchById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "patchEventById")
                .resolves(RESOLVED);

            const result = await eventService.patchById(EVENT_ID, EVENT_ARG);
            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:putById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "putEventById")
                .resolves(RESOLVED);

            const result = await eventService.putById(EVENT_ID, EVENT_ARG);
            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith();
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:readById", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEventById")
                .resolves(RESOLVED);

            const result = await eventService.readById(EVENT_ID);

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ID);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("method:listByCalendarId", () => {
        it("should run once with correct parameters and returns correctly", async () => {
            eventDaoStub = sinon
                .stub(EventDao.prototype, "getEventsByCalendarId")
                .resolves(RESOLVED);

            const result = await eventService.listByCalendarId(
                EVENT_ID,
                100,
                10
            );

            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith(EVENT_ID);
            expect(result).to.equal(RESOLVED);
        });
    });

    describe("read event by calendar_id", () => {
        it("should call function with proper arguments", async () => {
            eventDaoStub = sinon.stub(
                EventDao.prototype,
                "getEventByCalendarId"
            );

            await eventService.readByIdAndCalendarId("1", "1");
            expect(eventDaoStub).calledOnce;
            expect(eventDaoStub).calledWith("1", "1");
        });
    });
});
