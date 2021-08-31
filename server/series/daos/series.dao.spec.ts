import sinon, { SinonSpy, SinonStub, SinonSandbox } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import SeriesDao from "./series.dao";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import * as messageService from "../../common/services/message/message.service";
import { query } from "express";
chai.use(sinonChai);
const SERIES_DATA = {
    title: "Test Series",
    description: "Test Series description",
    calendar_id: 1,
    start_time: "10:30",
    end_time: "14:30",
    start_recur: "08-31-2021",
    end_recur: "08-31-2022",
    days_of_week: [0, 1, 2],
};
const SERIES_RETURN_VALUE = { rows: [{ series_id: 1 }] };
const FAILED_ERROR = new Error("Failed");
const SERIES_ID = "1";

let queryStub: SinonStub = sinon.stub();
let spySuccess: SinonSpy;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;
describe("SeriesDao", () => {
    let SeriesDao = proxyquire("./series.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    let seriesDao: SeriesDao = new SeriesDao();
    before(() => {
        sandBox = sinon.createSandbox();
        spySuccess = sandBox.spy(messageService, "sendSuccess");
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });

    after(() => {
        sandBox.restore();
    });
    beforeEach(() => {
        queryStub.resolves(SERIES_RETURN_VALUE);
    });
    afterEach(() => {
        queryStub.reset();
        spySuccess.resetHistory();
        spyFailure.resetHistory();
    });

    it("tablename should equal ts.series", () => {
        expect(seriesDao["tableName"]).equals("ts.series");
    });

    //should check if query is called with proper arguments
    //check if sendSucces is called with proper arguments
    describe("add a series", () => {
        const sql = `INSERT INTO "ts.series" (title, description, calendar_id, start_time, end_time, start_recur, end_recur, days_of_week) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
        it("should send success message and run with proper arguments", async () => {
            await seriesDao.addSeries(SERIES_DATA);
            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                SERIES_DATA.title,
                SERIES_DATA.description,
                SERIES_DATA.calendar_id,
                SERIES_DATA.start_time,
                SERIES_DATA.end_time,
                SERIES_DATA.start_recur,
                SERIES_DATA.end_recur,
                [0, 1, 2],
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully created series",
                [],
                201
            );
        });

        it("should send failure with status 500", async () => {
            queryStub.throws(FAILED_ERROR);
            await seriesDao.addSeries(SERIES_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("get series", () => {
        it("getting all series should send success message and run with proper args", async () => {
            const sql = `SELECT * FROM "ts.series"`;
            await seriesDao.getSeries();

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, []);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved all series",
                SERIES_RETURN_VALUE.rows
            );
        });

        it("getting all series should handle erorr , send failure and send status 500", async () => {
            const sql = `SELECT * FROM "ts.series"`;
            queryStub.throws(FAILED_ERROR);
            await seriesDao.getSeries();

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });

        it("getting a series by id should send success and run with proper args", async () => {
            const sql = `SELECT * FROM "ts.series" WHERE series_id = $1`;

            await seriesDao.getSeriesById("1");

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, ["1"]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith("Successfully retrieved series", {
                series_id: 1,
            });
        });

        it("if no series is found send failure with 404 status", async () => {
            const sql = `SELECT * FROM "ts.series" WHERE series_id = $1`;
            queryStub.resolves({ rows: [] });

            await seriesDao.getSeriesById("1");

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith("No series found with id: 1");
        });

        it("getting a series should handle error, send failure status 500", async () => {
            const sql = `SELECT * FROM "ts.series" WHERE series_id = $1`;
            queryStub.throws(FAILED_ERROR);

            await seriesDao.getSeriesById("1");

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("update series", () => {
        it("put a series change should send success and run with proper args", async () => {
            const sql = `UPDATE "ts.series" SET title = $2, description = $3, calendar_id = $4, start_time = $5, end_time = $6, start_recur = $7, end_recur = $8, days_of_week = $9 WHERE series_id = $1`;

            await seriesDao.putSeriesById(SERIES_ID, SERIES_DATA);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                SERIES_ID,
                SERIES_DATA.title,
                SERIES_DATA.description,
                SERIES_DATA.calendar_id,
                SERIES_DATA.start_time,
                SERIES_DATA.end_time,
                SERIES_DATA.start_recur,
                SERIES_DATA.end_recur,
                [0, 1, 2],
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated series",
                Object.assign(SERIES_DATA, { series_id: SERIES_ID })
            );
        });

        it("put a series change should handle error with sendFailure and status 500", async () => {
            queryStub.throws(FAILED_ERROR);

            await seriesDao.putSeriesById(SERIES_ID, SERIES_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });

        it("patch a series change should send success and run with proper args", async () => {
            const sql = `UPDATE "ts.series" SET title = $2, description = $3, calendar_id = $4, start_time = $5, end_time = $6, start_recur = $7, end_recur = $8, days_of_week = $9 WHERE series_id = $1`;

            await seriesDao.patchSeriesById(SERIES_ID, SERIES_DATA);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                SERIES_ID,
                SERIES_DATA.title,
                SERIES_DATA.description,
                SERIES_DATA.calendar_id,
                SERIES_DATA.start_time,
                SERIES_DATA.end_time,
                SERIES_DATA.start_recur,
                SERIES_DATA.end_recur,
                [0, 1, 2],
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated series",
                Object.assign(SERIES_DATA, { series_id: SERIES_ID })
            );
        });

        it("patch a series change should handle error with sendFailure and status 500", async () => {
            queryStub.throws(FAILED_ERROR);

            await seriesDao.patchSeriesById(SERIES_ID, SERIES_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });

    describe("remove series", () => {
        const sql = `DELETE FROM "ts.series" WHERE series_id = $1`;
        it("should send success and run with proper args", async () => {
            await seriesDao.removeSeriesById(SERIES_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [SERIES_ID]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully removed series",
                [],
                204
            );
        });

        it("should handle error send failure with status 500", async () => {
            queryStub.throws(FAILED_ERROR);

            await seriesDao.removeSeriesById(SERIES_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(
                FAILED_ERROR.message,
                FAILED_ERROR,
                500
            );
        });
    });
});
