import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import EventService from "../services/event.service";
import eventController from "./event.controller";
import express from "express";
import { createRequest, createResponse } from "node-mocks-http";
import { http } from "winston";

const EVENT_DATA = [
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
    },
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
    },
    {
        date_end: "2021-07-29 15:30:00",
        date_start: "2021-07-29 14:30:00",
        title: "Our First Event",
        all_day: true,
        user_id: 1,
        calendar_id: 1,
    },
];
const FAIL_RESULT = "REQUEST FAILED";
const CALENDAR_ID = 1,
    EVENT_ID = 1;
let eventServiceStub = sinon.stub();

describe("EventController", () => {
    beforeEach(() => {});
    afterEach(() => {
        sinon.restore();
        eventServiceStub.reset();
    });
    describe("method:listEvents", () => {
        it("should return all events and status 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "listByCalendarId")
                .resolves(EVENT_DATA);

            let req = createRequest({
                body: {
                    calendarId: CALENDAR_ID,
                    limit: 100,
                    page: 1,
                },
            });

            let res = createResponse();
            await eventController.listEvents(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(CALENDAR_ID, 100, 1);
            expect(res._getData()).to.equal(EVENT_DATA);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:getEventById", () => {
        it("should return event with status code 200", async () => {
            eventServiceStub = sinon
                .stub(EventService.prototype, "readById")
                .resolves(EVENT_DATA[0]);

            let req = createRequest({
                body: {
                    eventId: 1,
                },
            });

            let res = createResponse();

            await eventController.getEventById(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(1);
            expect(res._getData()).to.equal(EVENT_DATA[0]);
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:createEvent", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon.stub(EventService.prototype, "create");

            let req = createRequest({
                body: {},
            });
            let res = createResponse();

            await eventController.createEvent(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith({});
            expect(res._getData()).to.include.keys("success");
            expect(res._getData().success).to.equal(
                "Event Successfully Created"
            );
            expect(res.statusCode).to.equal(200);
        });
    });

    describe("method:patch", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon.stub(EventService.prototype, "patchById");
            const body = { eventId: 1 };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventController.patch(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(body.eventId, body);
            expect(res._getData()).to.include.keys("success");
            expect(res._getData().success).to.equal(
                `Event id:${req.body.eventId} successfully Patched`
            );
            expect(res.statusCode).to.equal(204);
        });
    });

    describe("method:put", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon.stub(EventService.prototype, "putById");
            const body = { eventId: 1 };
            let req = createRequest({
                body: body,
            });
            let res = createResponse();

            await eventController.put(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(body.eventId, body);
            expect(res._getData()).to.include.keys("success");
            expect(res._getData().success).to.equal(
                `Event id:${req.body.eventId} successfully Updated`
            );
            expect(res.statusCode).to.equal(204);
        });
    });

    describe("method:removeEvent", () => {
        it("should return success message and status code 200", async () => {
            eventServiceStub = sinon.stub(EventService.prototype, "deleteById");

            let req = createRequest({
                body: {
                    eventId: EVENT_ID,
                },
            });
            let res = createResponse();

            await eventController.removeEvent(req, res);

            expect(eventServiceStub).calledOnce;
            expect(eventServiceStub).calledWith(EVENT_ID);
            expect(res._getData()).to.include.keys("success");
            expect(res._getData().success).to.equal(
                `Event id:${req.body.eventId} successfully Deleted`
            );
        });
    });
});
