import sinon from "sinon";
import { expect } from "chai";
import EventService from "../services/event.service";
import EventController from "./event.controller";
import { createRequest, createResponse } from "node-mocks-http";
import EventsController from "./event.controller";

const EVENT_DATA = [
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
        description: "Test Events",
    },
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
        description: "Test Events",
    },
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
        description: "Test Events",
    },
];
const FAILED = { success: false, message: "PROCESS FAILED", statusCode: 400 };
const RESOLVED = {
    success: true,
    message: "PROCESS RESOLVED",
    statusCode: 200,
};
const CALENDAR_ID = 1,
    EVENT_ID = 1;
let eventServiceStub = sinon.stub();
let eventController: EventsController;

describe("EventController", () => {
    beforeEach(() => {
        eventController = new EventController();
    });
    afterEach(() => {
        sinon.restore();
        eventServiceStub.reset();
    });
    describe("method:listEvents", () => {
        it("should return all events and status 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "listByCalendarId")
                .resolves(RESOLVED);
            let req = createRequest({
                body: {
                    calendar_id: CALENDAR_ID,
                    limit: 100,
                    page: 1,
                },
            });

            let res = createResponse();
            await eventController.listEvents(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(CALENDAR_ID, 100, 1);
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:getEventById", () => {
        it("should return event with status code 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "readById")
                .resolves(RESOLVED);

            let req = createRequest({
                body: {
                    event_id: 1,
                },
            });

            let res = createResponse();

            await eventController.getEventById(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(1);
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:createEvent", () => {
        it("should return success message", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "create")
                .resolves(RESOLVED);
            let req = createRequest({
                body: {},
            });
            let res = createResponse();

            await eventController.createEvent(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith({});
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:patch", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "patchById")
                .resolves(RESOLVED);
            const body = { event_id: 1 };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventController.patch(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(body.event_id, body);
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:put", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "putById")
                .resolves(RESOLVED);
            const body = { event_id: 1 };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventController.put(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(body.event_id, body);
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:removeEvent", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "deleteById")
                .resolves(RESOLVED);

            let req = createRequest({
                body: {
                    event_id: EVENT_ID,
                },
            });
            let res = createResponse();

            await eventController.removeEvent(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(EVENT_ID);
            expect(res._getData()).to.equal(RESOLVED);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("should get event by calendar_id", () => {
        it("should send proper response with proper statusCode", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "readByIdAndCalendarId")
                .resolves(RESOLVED);
            let req = createRequest({
                body: {
                    calendar_id: "1",
                    event_id: "1",
                },
            });

            let res = createResponse();

            await eventController.getEventByIdAndCalendarId(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED);
        });
    });
});
