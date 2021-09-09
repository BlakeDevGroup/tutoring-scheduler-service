import sinon, { SinonSandbox, SinonSpy, SinonStub } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import CompanyDao from "./company.dao";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import * as messageService from "../../common/services/message/message.service";
import { query } from "winston";
chai.use(sinonChai);

const FAILED: ServerResponsePayload = {
    message: "failed",
    success: false,
    error: new Error(),
    statusCode: 500,
};

const ERROR = new Error("Fake Error");
const COMPANY_DATA = { name: "My Company", pay_rate: 25.0, color: "red" };
const COMPANY_RESPONSE = {
    rows: [COMPANY_DATA],
};
const COMPANY_ID = "1";

let queryStub: SinonStub = sinon.stub();
let spySuccess: SinonSpy;
let spyFailure: SinonSpy;
let sandBox: SinonSandbox;

describe("CompanyDao", () => {
    let CompanyDao = proxyquire("./company.dao", {
        "../../common/services/postgres.service": { query: queryStub },
    }).default;
    const companyDao: CompanyDao = new CompanyDao();
    before(() => {
        sandBox = sinon.createSandbox();
        spySuccess = sandBox.spy(messageService, "sendSuccess");
        spyFailure = sandBox.spy(messageService, "sendFailure");
    });
    after(() => {
        sandBox.restore();
    });
    beforeEach(() => {
        queryStub.resolves(COMPANY_RESPONSE);
    });
    afterEach(() => {
        queryStub.reset();
        spySuccess.resetHistory();
        spyFailure.resetHistory();
    });

    it("tablename should equal ts.companies", () => {
        expect(companyDao["tableName"]).equals("ts.companies");
    });

    describe("getting all companies", () => {
        const SUCCESS: ServerResponsePayload = {
            message: "Successfully retrieved companies",
            success: true,
            data: [],
            statusCode: 200,
        };
        it("should run with correct parameters and return successPayload", async () => {
            const SQL = `SELECT * FROM "ts.companies"`;
            await companyDao.getCompanies();

            expect(queryStub).calledWith(SQL, []);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved companies",
                COMPANY_RESPONSE.rows
            );
        });

        it("when an error is thrown then return failurePayload with status 500", async () => {
            const SQL = `SELECT * FROM "ts.companies"`;
            queryStub.throws(ERROR);
            await companyDao.getCompanies();

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("get company by id", () => {
        it("when query is successful then send success response", async () => {
            const SQL = `SELECT * FROM "ts.companies" WHERE company_id = $1`;
            queryStub.returns(COMPANY_RESPONSE);
            await companyDao.getCompanyById(COMPANY_ID);

            expect(queryStub).calledWith(SQL, [COMPANY_ID]);
            expect(queryStub).calledOnce;
            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully retrieved company",
                COMPANY_RESPONSE.rows[0]
            );
        });

        it("when query is successful but no data is found, send failure with status 404", async () => {
            queryStub.returns({ rows: [] });

            await companyDao.getCompanyById(COMPANY_ID);
            expect(spyFailure).calledOnce;
            expect(spyFailure.args[0][0]).equal(
                `No company found with id: ${COMPANY_ID}`
            );
            expect(spyFailure.args[0][2]).equal(404);
        });

        it("when an error is thrown then sendFailure with status 500", async () => {
            queryStub.throws(ERROR);

            await companyDao.getCompanyById(COMPANY_ID);
            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR);
        });
    });

    describe("add company", () => {
        it("when success then sendSuccess with status 201", async () => {
            const sql = `INSERT INTO "ts.companies" (name, pay_rate, color) VALUES ($1, $2, $3)`;

            await companyDao.addCompany(COMPANY_DATA);

            expect(queryStub).calledWith(sql, [
                COMPANY_DATA.name,
                COMPANY_DATA.pay_rate,
                COMPANY_DATA.color,
            ]);
            expect(queryStub).calledOnce;

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully created company",
                COMPANY_RESPONSE.rows[0],
                201
            );
        });

        it("when error is thrown then sendFailure with status 500", async () => {
            queryStub.throws(ERROR);

            await companyDao.addCompany(COMPANY_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("update company", () => {
        it("when put success then sendSuccess with status 200", async () => {
            const sql = `UPDATE "ts.companies" SET name = $2, pay_rate = $3, color = $4 WHERE company_id = $1`;
            await companyDao.putCompanyById(COMPANY_ID, COMPANY_DATA);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                COMPANY_ID,
                COMPANY_DATA.name,
                COMPANY_DATA.pay_rate,
                COMPANY_DATA.color,
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated company",
                Object.assign(COMPANY_DATA, { company_id: COMPANY_ID })
            );
        });

        it("when error is thrown then sendFailure with status 500", async () => {
            queryStub.throws(ERROR);

            await companyDao.putCompanyById(COMPANY_ID, COMPANY_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });

        it("when patch success then sendSuccess with status 200", async () => {
            const sql = `UPDATE "ts.companies" SET name = $2, pay_rate = $3, color = $4 WHERE company_id = $1`;
            await companyDao.patchCompanyById(COMPANY_ID, COMPANY_DATA);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [
                COMPANY_ID,
                COMPANY_DATA.name,
                COMPANY_DATA.pay_rate,
                COMPANY_DATA.color,
            ]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith(
                "Successfully updated company",
                Object.assign(COMPANY_DATA, { company_id: COMPANY_ID })
            );
        });

        it("when error is thrown then sendFailure with status 500", async () => {
            queryStub.throws(ERROR);

            await companyDao.patchCompanyById(COMPANY_ID, COMPANY_DATA);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });

    describe("remove company", () => {
        const sql = `DELETE FROM "ts.companies" WHERE company_id = $1`;
        it("when success then sendSuccess with status 204", async () => {
            await companyDao.removeCompanyById(COMPANY_ID);

            expect(queryStub).calledOnce;
            expect(queryStub).calledWith(sql, [COMPANY_ID]);

            expect(spySuccess).calledOnce;
            expect(spySuccess).calledWith("Successfully removed company");
        });

        it("when error is thrown then sendFailure with status 500", async () => {
            queryStub.throws(ERROR);

            await companyDao.removeCompanyById(COMPANY_ID);

            expect(spyFailure).calledOnce;
            expect(spyFailure).calledWith(ERROR.message, ERROR, 500);
        });
    });
});
