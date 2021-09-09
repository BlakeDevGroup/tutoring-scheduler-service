import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import CompanyService from "./company.service";
import CompanyDao from "../daos/company.dao";

let companyDao: CompanyDao;
let companyService: CompanyService;
let companyDaoStub: SinonStub = sinon.stub();

const RESOLVED = {
    success: true,
    message: "PROCESS RESOLVED",
    statusCode: 200,
};
const COMPANY_DATA = { name: "My Company", pay_rate: 25, color: "red" };
const COMPANY_ID = "1";

describe("CompanyService", () => {
    beforeEach(() => {
        companyDao = new CompanyDao();
        companyService = new CompanyService();
    });

    afterEach(() => {
        sinon.restore();
        companyDaoStub.reset();
    });

    describe("create company", () => {
        it("should run dao create with proper arguments", async () => {
            companyDaoStub = sinon.stub(CompanyDao.prototype, "addCompany");

            await companyService.create(COMPANY_DATA);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith(COMPANY_DATA);
        });
    });

    describe("list companies", () => {
        it("should run dao get all with proper arguments", async () => {
            companyDaoStub = sinon.stub(CompanyDao.prototype, "getCompanies");

            await companyService.list(1, 1);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith();
        });
    });

    describe("get company", () => {
        it("should run dao get by id with proper arguments", async () => {
            companyDaoStub = sinon.stub(CompanyDao.prototype, "getCompanyById");

            await companyService.readById(COMPANY_ID);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith(COMPANY_ID);
        });
    });

    describe("remove company", () => {
        it("should run dao delete with proper arguments", async () => {
            companyDaoStub = sinon.stub(
                CompanyDao.prototype,
                "removeCompanyById"
            );

            await companyService.deleteById(COMPANY_ID);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith(COMPANY_ID);
        });
    });

    describe("put company", () => {
        it("should run dao put with proper arguments", async () => {
            companyDaoStub = sinon.stub(CompanyDao.prototype, "putCompanyById");

            await companyService.putById(COMPANY_ID, COMPANY_DATA);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith(COMPANY_ID, COMPANY_DATA);
        });
    });

    describe("patch company", () => {
        it("should run dao patch with proper arguments", async () => {
            companyDaoStub = sinon.stub(
                CompanyDao.prototype,
                "patchCompanyById"
            );

            await companyService.patchById(COMPANY_ID, COMPANY_DATA);

            expect(companyDaoStub).calledOnce;
            expect(companyDaoStub).calledWith(COMPANY_ID, COMPANY_DATA);
        });
    });
});
