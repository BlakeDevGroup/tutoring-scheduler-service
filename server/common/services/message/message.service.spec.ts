import sinonChai from "sinon-chai";
import { sendSuccess, sendFailure } from "./message.service";
import sinon from "sinon";
import { expect } from "chai";

describe("Message Service", () => {
    it("should return ISuccessPayload and status code 200", () => {
        let spy = sinon.spy(sendSuccess);
        const result = sendSuccess("Test Example", { data: [] });

        expect(result)
            .to.be.an("object")
            .and.include.keys("success", "message", "data", "statusCode");
        expect(result.statusCode).to.equal(200);
        expect(result.success).to.equal(true);
        expect(result.data).to.deep.equal({ data: [] });
        expect(result.message).to.equal("Test Example");
    });

    it("should return IErrorPayload and status code 400", () => {
        let spy = sinon.spy(sendFailure);
        const error = new Error("Process Failed");
        const result = sendFailure("Test Failure", error);

        expect(result)
            .to.be.an("object")
            .and.include.keys("success", "message", "error");

        expect(result.statusCode).to.equal(400);
        expect(result.success).to.equal(false);
        expect(result.error).to.deep.equal(error);
        expect(result.message).to.equal("Test Failure");
    });

    it("should return IErrorPayload and status code 404", () => {
        let spy = sinon.spy(sendFailure);
        const error = new Error("Process Failed");
        const result = sendFailure("Test Failure", error, 404);

        expect(result)
            .to.be.an("object")
            .and.include.keys("success", "message", "error");

        expect(result.statusCode).to.equal(404);
        expect(result.success).to.equal(false);
        expect(result.error).to.deep.equal(error);
        expect(result.message).to.equal("Test Failure");
    });

    it("should return ISuccessPayload and status code 201", () => {
        let spy = sinon.spy(sendSuccess);
        const result = sendSuccess("Test Example", { data: [] }, 201);

        expect(result)
            .to.be.an("object")
            .and.include.keys("success", "message", "data", "statusCode");
        expect(result.statusCode).to.equal(201);
        expect(result.success).to.equal(true);
        expect(result.data).to.deep.equal({ data: [] });
        expect(result.message).to.equal("Test Example");
    });
});
