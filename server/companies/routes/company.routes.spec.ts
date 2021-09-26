import sinon from "sinon";
import { expect } from "chai";
import request from "supertest";
import express from "express";

import { CompanyRoutes } from "./company.routes";

let app: express.Application = express();
app.use(express.json());
new CompanyRoutes(app).configureRoutes();
const COMPANY_ID = "128";
let COMPANY_PAYLOAD = {
    name: "Test Company",
    pay_rate: 25,
    color: "#001122",
};

describe("CompanyRoutes", () => {
    beforeEach(() => {});

    afterEach(() => {
        sinon.restore();
    });

    describe("GET /companies", () => {
        it("should return all companies with statusCode 200", async () => {
            const response = await request(app).get("/companies");

            expect(response.statusCode).to.equal(200);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully retrieved companies"
            );

            expect(response.body.data).to.be.an("array");
            expect(response.body.data.length).to.be.greaterThan(0);

            expect(response.body.data[0])
                .to.be.an("object")
                .and.include.keys("company_id", "name", "color", "pay_rate");
        });
    });

    describe("POST /companies", async () => {
        it("should return error with status 400 when name is not a string", async () => {
            const VALUE = 123;

            const response = await request(app)
                .post("/companies")
                .send(Object.assign({}, COMPANY_PAYLOAD, { name: VALUE }));

            expect(response.statusCode).to.equal(400);
            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: name value: ${VALUE}`
            );
        });

        it("should return error with status 400 when pay_rate is not numeric", async () => {
            const VALUE = "xxx";

            const response = await request(app)
                .post("/companies")
                .send(Object.assign({}, COMPANY_PAYLOAD, { pay_rate: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: pay_rate value: ${VALUE}`
            );
        });

        it("should return error with status 400 when color is not a string", async () => {
            const VALUE = 123;

            const response = await request(app)
                .post("/companies")
                .send(Object.assign({}, COMPANY_PAYLOAD, { color: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: color value: ${VALUE}`
            );
        });

        it("should create company send success with status 201", async () => {
            const response = await request(app)
                .post("/companies")
                .send(COMPANY_PAYLOAD);

            expect(response.statusCode).to.equal(201);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");
            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully created company"
            );

            expect(response.body.data).to.eql([]);
        });
    });

    describe("GET /companies/:company_id", () => {
        it("should return error wtih status 404 when company_id does not exist", async () => {
            const response = await request(app).get("/companies/9999");

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.message).to.equal(
                "No company found with id: 9999"
            );
        });

        it("should return success with status 200", async () => {
            const response = await request(app).get(`/companies/${COMPANY_ID}`);

            expect(response.statusCode).to.equal(200);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.message).to.equal(
                "Successfully retrieved company"
            );

            expect(response.body.data).to.be.an("object");
        });
    });

    describe("PUT /companies/:company_id", () => {
        it("should return error with status 404 when company_id does not exists", async () => {
            const response = await request(app).put("/companies/9999");

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.message).to.equal(
                "No company found with id: 9999"
            );
        });

        it("should return error with stauts 400 when name is not a string", async () => {
            const VALUE = 123;
            const response = await request(app)
                .put(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { name: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: name value: ${VALUE}`
            );
        });

        it("should return error with stauts 400 when pay_rate is not a numeric", async () => {
            const VALUE = "xxx";
            const response = await request(app)
                .put(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { pay_rate: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: pay_rate value: ${VALUE}`
            );
        });

        it("should return error with stauts 400 when color is not a numeric", async () => {
            const VALUE = 123;
            const response = await request(app)
                .put(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { color: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: color value: ${VALUE}`
            );
        });

        it("should update company with statusCode 200 and send updated company", async () => {
            const response = await request(app)
                .put(`/companies/${COMPANY_ID}`)
                .send(COMPANY_PAYLOAD);

            expect(response.statusCode).to.equal(200);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully updated company"
            );

            expect(response.body.data).to.be.an("object");
        });
    });

    describe("PATCH /companies/:company_id", () => {
        it("should return error with status 404 when company_id does not exists", async () => {
            const response = await request(app).patch("/companies/9999");

            expect(response.statusCode).to.equal(404);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.message).to.equal(
                "No company found with id: 9999"
            );
        });

        it("should return error with stauts 400 when name is not a string", async () => {
            const VALUE = 123;
            const response = await request(app)
                .patch(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { name: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: name value: ${VALUE}`
            );
        });

        it("should return error with stauts 400 when pay_rate is not a numeric", async () => {
            const VALUE = "xxx";
            const response = await request(app)
                .patch(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { pay_rate: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: pay_rate value: ${VALUE}`
            );
        });

        it("should return error with stauts 400 when color is not a numeric", async () => {
            const VALUE = 123;
            const response = await request(app)
                .patch(`/companies/${COMPANY_ID}`)
                .send(Object.assign({}, COMPANY_PAYLOAD, { color: VALUE }));

            expect(response.statusCode).to.equal(400);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "error");

            expect(response.body.success).to.equal(false);
            expect(response.body.message).to.equal(
                `Invalid value for param: color value: ${VALUE}`
            );
        });

        it("should update company with statusCode 200 and send updated company", async () => {
            const response = await request(app)
                .patch(`/companies/${COMPANY_ID}`)
                .send(COMPANY_PAYLOAD);

            expect(response.statusCode).to.equal(200);

            expect(response.body)
                .to.be.an("object")
                .and.include.keys("success", "message", "data");

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully updated company"
            );

            expect(response.body.data).to.be.an("object");
        });
    });

    describe("DELETE /companies/:company_id", () => {
        it("should delete compapny with status 200", async () => {
            const response = await request(app).delete(
                `/companies/${COMPANY_ID}`
            );

            expect(response.statusCode).to.equal(200);

            expect(response.body.success).to.equal(true);
            expect(response.body.message).to.equal(
                "Successfully removed company"
            );

            expect(response.body.data).to.be.an("array");
        });
    });
});
