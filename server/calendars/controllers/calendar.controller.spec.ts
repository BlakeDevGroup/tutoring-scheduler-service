import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createRequest, createResponse } from "node-mocks-http";
import CalendarController from "./calendar.controller";
import CalendarService from "../services/calendar.service";

let calendarController: CalendarController;
let calendarServiceStub: SinonStub;
const RESOLVED = (statusCode = 200) => {
    return {
        success: true,
        message: "PROCESS RESOLVED",
        statusCode: statusCode,
    };
};
const ERROR = new Error("PROCESS FAILED");
const FAILED = (statusCode = 400) => {
    return {
        success: false,
        message: "PROCESS FAILED",
        statusCode: statusCode,
        error: ERROR,
    };
};
const CALENDAR_ID = "1";
describe("CalendarController", () => {
    beforeEach(() => {
        calendarServiceStub = sinon.stub();
        calendarController = new CalendarController();
    });
    afterEach(() => {
        sinon.reset();
        calendarServiceStub.restore();
    });

    describe("list all calendars", () => {
        it("should return all calendars with status 200", async () => {
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "list")
                .resolves(RESOLVED());

            let req = createRequest({
                body: {
                    calendar_id: "1",
                    limit: 100,
                    page: 0,
                },
            });

            let res = createResponse();
            await calendarController.ListCalendars(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(100, 0);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should send status 400 and return an error", async () => {
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "list")
                .resolves(FAILED(400));

            let req = createRequest({
                body: { calendar_id: 1, limit: 100, page: 0 },
            });

            let res = createResponse();

            await calendarController.ListCalendars(req, res);

            const data = res._getData();
            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(100, 0);
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("get a calendar", () => {
        it("should get calendar by id and send status 200", async () => {
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "readById")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { calendar_id: 1 },
            });

            let res = createResponse();

            await calendarController.getCalendarById(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should send status 404 and return an error", async () => {
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "readById")
                .resolves(FAILED(404));

            let req = createRequest({
                body: { calendar_id: 1 },
            });

            let res = createResponse();

            await calendarController.getCalendarById(req, res);

            const data = res._getData();
            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1);
            expect(res.statusCode).to.equal(404);
            expect(data.success).to.equal(FAILED(404).success);
            expect(data.message).to.equal(FAILED(404).message);
            expect(data.statusCode).to.equal(FAILED(404).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("create a calendar", () => {
        it("should create calendar and send status 201", async () => {
            let statusCode = 200;
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "create")
                .resolves(RESOLVED(statusCode));

            let req = createRequest({
                body: { name: "My Calendar" },
            });

            let res = createResponse();

            await calendarController.createCalendar(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith({ name: "My Calendar" });
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(RESOLVED(statusCode));
        });

        it("should return error with status 400", async () => {
            let statusCode = 400;
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "create")
                .resolves(FAILED(statusCode));

            let req = createRequest({
                body: { name: "My Calendar" },
            });

            let res = createResponse();

            await calendarController.createCalendar(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith({ name: "My Calendar" });
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(FAILED(statusCode));
        });
    });

    describe("patch a calendar entity", () => {
        it("should patch calendar, return result and status code 200", async () => {
            let statusCode = 200;
            let body = {
                calendar_id: 1,
                name: "My Calendar",
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "patchById")
                .resolves(RESOLVED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.patch(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1, body);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(RESOLVED(statusCode));
        });

        it("should return error and status code 400", async () => {
            let statusCode = 400;
            let body = {
                calendar_id: 1,
                name: "My Calendar",
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "patchById")
                .resolves(FAILED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.patch(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1, body);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(FAILED(statusCode));
        });
    });

    describe("put a calendar entity", () => {
        it("should put calendar, return result and status code 200", async () => {
            let statusCode = 200;
            let body = {
                calendar_id: 1,
                name: "My Calendar",
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "putById")
                .resolves(RESOLVED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.put(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1, body);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(RESOLVED(statusCode));
        });

        it("should return error and status code 400", async () => {
            let statusCode = 400;
            let body = {
                calendar_id: 1,
                name: "My Calendar",
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "putById")
                .resolves(FAILED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.put(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1, body);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(FAILED(statusCode));
        });
    });

    describe("delete a calednar entity", () => {
        it("should remove calendar entity with status 200", async () => {
            let statusCode = 200;
            let body = {
                calendar_id: 1,
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "deleteById")
                .resolves(RESOLVED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.removeCalendar(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(RESOLVED(statusCode));
        });

        it("should return error wtih status code 400", async () => {
            let statusCode = 400;
            let body = {
                calendar_id: 1,
            };
            calendarServiceStub = sinon
                .stub(CalendarService.prototype, "deleteById")
                .resolves(FAILED(statusCode));

            let req = createRequest({ body });

            let res = createResponse();

            await calendarController.removeCalendar(req, res);

            expect(calendarServiceStub).calledOnce;
            expect(calendarServiceStub).calledWith(1);
            expect(res.statusCode).to.equal(statusCode);
            expect(res._getData()).to.deep.equal(FAILED(statusCode));
        });
    });
});
