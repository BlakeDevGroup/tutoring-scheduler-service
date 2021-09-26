import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from "chai";
import SeriesService from "./series.service";
import SeriesDao from "../daos/series.dao";
import { isToken } from "typescript";

let seriesDao: SeriesDao;
let seriesService: SeriesService;
let seriesDaoStub: SinonStub;

const SERIES_DATA = {
    title: "Test Series",
    description: "Test Series description",
    calendar_id: 1,
    start_time: "10:30",
    end_time: "14:30",
    start_recur: "8-31-2021",
    end_recur: "8-31-2022",
    days_of_week: [0, 1, 2],
    user_id: "1",
    company_id: "1",
};
const SERIES_ID = "1";
describe("SeriesService", () => {
    beforeEach(() => {
        seriesDao = new SeriesDao();
        seriesService = new SeriesService();
        seriesDaoStub = sinon.stub();
    });

    afterEach(() => {
        sinon.reset();
        seriesDaoStub.reset();
    });

    describe("create series", () => {
        it("should run dao procedure with proper resource", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "addSeries");
            await seriesService.create(SERIES_DATA);

            expect(seriesDaoStub).calledOnce;
            expect(seriesDaoStub).calledWith(SERIES_DATA);
        });
    });

    describe("delete series", () => {
        it("should run dao procedure with proper resource", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "removeSeriesById");

            await seriesService.deleteById(SERIES_ID);

            expect(seriesDaoStub).calledOnceWith(SERIES_ID);
        });
    });

    describe("list series", () => {
        it("should run dao procedure with proper args", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "getSeries");

            await seriesService.list(100, 0);

            expect(seriesDaoStub).calledOnceWith();
        });
    });

    describe("update series", () => {
        it("should run patch dao procedure with proper args", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "patchSeriesById");

            await seriesService.patchById(SERIES_ID, SERIES_DATA);

            expect(seriesDaoStub).calledOnce;
            expect(seriesDaoStub).calledWith(SERIES_ID, SERIES_DATA);
        });

        it("should run put dao procedure with proper args", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "putSeriesById");

            await seriesService.putById(SERIES_ID, SERIES_DATA);

            expect(seriesDaoStub).calledOnce;
            expect(seriesDaoStub).calledWith(SERIES_ID, SERIES_DATA);
        });
    });

    describe("get series", () => {
        it("should run get dao procedure with proper args", async () => {
            seriesDaoStub = sinon.stub(SeriesDao.prototype, "getSeriesById");

            await seriesService.readById(SERIES_ID);

            expect(seriesDaoStub).calledOnce;
            expect(seriesDaoStub).calledWith(SERIES_ID);
        });

        it("should run get dao procedure by calendar_id with proper args", async () => {
            seriesDaoStub = sinon.stub(
                SeriesDao.prototype,
                "getSeriesByIdAndCalendarId"
            );

            await seriesService.readByIdAndCalendarId(SERIES_ID, "1");

            expect(seriesDaoStub).calledOnce;
            expect(seriesDaoStub).calledWith(SERIES_ID, "1");
        });
    });
});
