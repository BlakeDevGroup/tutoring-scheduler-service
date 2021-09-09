import sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { createResponse, createRequest } from "node-mocks-http";
import express from "express";
import { ServerResponsePayload } from "../../common/services/message/message.service";
import CompanyMiddleware from "./company.middleware";
import CompanyService from "../services/company.service";

const RESOLVED: ServerResponsePayload = {
    message: "Success",
    statusCode: 200,
    data: [],
    success: true,
};

const FAILED: ServerResponsePayload = {
    message: "Failed",
    statusCode: 404,
    error: new Error("Failed"),
    success: false,
};

const COMPANY_ID = "1";
let next: express.NextFunction;
let companyMiddleware: CompanyMiddleware;
let stub: SinonStub;

describe.only("CompanyMiddleware", () => {
    beforeEach(() => {
        next = sinon.stub().callsFake(() => {});
        companyMiddleware = new CompanyMiddleware();
        stub = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("validate company exists", () => {
        it("should validate company exists", async () => {
            stub = sinon
                .stub(CompanyService.prototype, "readById")
                .resolves(RESOLVED);

            let req = createRequest({
                params: { company_id: COMPANY_ID },
            });
            let res = createResponse();

            await companyMiddleware.validateCompanyExists(req, res, next);

            expect(next).calledOnce;
            expect(stub).calledOnce;
            expect(stub).calledWith(COMPANY_ID);
        });

        it("calendar does not exist and sendsFailure of status 404", async () => {
            stub = sinon
                .stub(CompanyService.prototype, "readById")
                .resolves(FAILED);

            let req = createRequest({
                params: { company_id: 1 },
            });
            let res = createResponse();

            await companyMiddleware.validateCompanyExists(req, res, next);

            expect(next).not.called;
            expect(stub).calledOnce;
            expect(stub).calledWith(1);
            expect(res.statusCode).to.equal(404);
            expect(res._getData())
                .to.be.an("object")
                .and.include.keys("success", "message", "error");
            expect(res._getData().message).to.equal(FAILED.message);
            expect(res._getData().success).to.equal(FAILED.success);
            expect(res._getData().statusCode).to.equal(FAILED.statusCode);
        });
    });

    describe("extract company id", () => {
        it("should extract company id from parameter and call next()", async () => {
            let req = createRequest({
                params: { company_id: COMPANY_ID },
            });

            let res = createResponse();

            await companyMiddleware.extractCompanyId(req, res, next);

            expect(next).calledOnce;
            expect(req.body).to.include.keys("company_id");
            expect(req.body.company_id).to.equal(COMPANY_ID);
        });
    });
});
