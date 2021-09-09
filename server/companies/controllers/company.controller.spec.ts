import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createRequest, createResponse } from "node-mocks-http";
import CompanyController from "./company.controller";
import CompanyService from "../services/company.service";

let companyController: CompanyController;
let companyServiceStub: SinonStub;
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
const COMPANY_ID = "1";

describe("CompanyController", () => {
    beforeEach(() => {
        companyServiceStub = sinon.stub();
        companyController = new CompanyController();
    });
    afterEach(() => {
        sinon.reset();
        companyServiceStub.restore();
    });

    describe("list all companies", () => {
        it("should return all companies with status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "list")
                .resolves(RESOLVED());

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                    limit: 100,
                    page: 0,
                },
            });

            let res = createResponse();

            await companyController.listCompanies(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(100, 0);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should send status 400 and return an error", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "list")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                    limit: 100,
                    page: 0,
                },
            });

            let res = createResponse();

            await companyController.listCompanies(req, res);

            const data = res._getData();
            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(100, 0);
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("get a calendar", () => {
        it("should run getCalendarId and send status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "readById")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyController.getCompanyById(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(COMPANY_ID);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should catch error and send error with status 400", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "readById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                },
            });

            let res = createResponse();

            await companyController.getCompanyById(req, res);

            const data = res._getData();
            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(COMPANY_ID);
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("create company", () => {
        it("should run create with proper arguments and send status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "create")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyController.createCompany(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith({ company_id: COMPANY_ID });
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should catch error and send status 400", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "create")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                },
            });

            let res = createResponse();

            await companyController.createCompany(req, res);

            const data = res._getData();
            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith({
                company_id: COMPANY_ID,
            });
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("update company", () => {
        it("should run put with proper arguments and send status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "putById")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyController.put(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(COMPANY_ID, {
                company_id: COMPANY_ID,
            });
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should catch error and send status 500", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "putById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                },
            });

            let res = createResponse();

            await companyController.put(req, res);

            const data = res._getData();
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });

        it("should run patch with proper arguments and send status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "patchById")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyController.patch(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(COMPANY_ID, {
                company_id: COMPANY_ID,
            });
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should catch error and send status 500", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "patchById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                },
            });

            let res = createResponse();

            await companyController.patch(req, res);

            const data = res._getData();
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });

    describe("remove company", () => {
        it("should run delete with proper arguments and send status 200", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "deleteById")
                .resolves(RESOLVED());

            let req = createRequest({
                body: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyController.removeCompany(req, res);

            expect(companyServiceStub).calledOnce;
            expect(companyServiceStub).calledWith(COMPANY_ID);
            expect(res.statusCode).to.equal(200);
            expect(res._getData()).to.deep.equal(RESOLVED());
        });

        it("should catch error and send status 500", async () => {
            companyServiceStub = sinon
                .stub(CompanyService.prototype, "deleteById")
                .resolves(FAILED(400));

            let req = createRequest({
                body: {
                    company_id: COMPANY_ID,
                },
            });

            let res = createResponse();

            await companyController.removeCompany(req, res);

            const data = res._getData();
            expect(res.statusCode).to.equal(400);
            expect(data.success).to.equal(FAILED(400).success);
            expect(data.message).to.equal(FAILED(400).message);
            expect(data.statusCode).to.equal(FAILED(400).statusCode);
            expect(data.error).to.deep.equal(ERROR);
        });
    });
});
