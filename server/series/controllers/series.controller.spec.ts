import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createRequest, createResponse } from "node-mocks-http";
import SeriesController from "./series.controller";
import SeriesService from "../services/series.service";

let seriesController: SeriesController;
let seriesServiceStub: SinonStub;
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

describe("SeriesController", () => {
    beforeEach(() => {
        seriesController = new SeriesController();
        seriesServiceStub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        seriesServiceStub.restore();
    });

    describe("list all series", () => {
        it("should run list service procedure and send success with status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "list")
                .resolves(RESOLVED(200));
            let req = createRequest();
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.listSeries(req, res);
            expect(seriesServiceStub).calledOnce;
            expect(seriesServiceStub).calledWith(100, 0);

            expect(res.statusCode).to.equal(200);
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
            expect(res._getData()).to.eql(RESOLVED(200));
        });

        it("should run list service procedure and send success with status 201", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "list")
                .resolves(RESOLVED(201));
            let req = createRequest();
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.listSeries(req, res);

            expect(res.statusCode).to.equal(201);
            expect(res._getData()).to.eql(RESOLVED(201));

            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });
    });

    describe("get series", () => {
        it("should run get service procedure and send success with status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "readById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.getSeriesById(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });

        it("should run get by calendar_id service procedure and send success with status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "readByIdAndCalendarId")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: { series_id: 1, calendar_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.getSeriesByIdAndCalendarId(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });
    });

    describe("create series", () => {
        it("should run create service procedure and send status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "create")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: {},
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.createSeries(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });
    });

    describe("update series", () => {
        it("should run patch service procedure and send status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "patchById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.patch(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });

        it("should run patch service procedure and send status 205", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "patchById")
                .resolves(RESOLVED(205));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.patch(req, res);

            expect(res.statusCode).to.equal(205);
            expect(res._getData()).to.eql(RESOLVED(205));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });

        it("should run put service procedure and send status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "putById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.put(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });
    });

    describe("remove series", () => {
        it("should run delete service procedure and send status 200", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "deleteById")
                .resolves(RESOLVED(200));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.removeSeries(req, res);

            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.eql(RESOLVED(200));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });

        it("should run delete service procedure and send status 201", async () => {
            seriesServiceStub = sinon
                .stub(SeriesService.prototype, "deleteById")
                .resolves(RESOLVED(201));

            let req = createRequest({
                body: { series_id: 1 },
            });
            let res = createResponse();
            let spy = sinon.spy(res, "status");

            await seriesController.removeSeries(req, res);

            expect(res.statusCode).to.equal(201);
            expect(res._getData()).to.eql(RESOLVED(201));
            expect(spy).calledOnce;
            expect(spy).calledWith(res.statusCode);
        });
    });
});
