import { CommonRoutesConfig } from "../../common/common.routes.config";
import CompanyController from "../controllers/company.controller";
import companyMiddleware from "../middleware/company.middleware";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";
import { body } from "express-validator";

export class CompanyRoutes extends CommonRoutesConfig {
    private companyController: CompanyController = new CompanyController();
    private companyMiddleware: companyMiddleware = new companyMiddleware();
    private VALIDATE_PAYLOAD: any[];
    constructor(app: express.Application) {
        super(app, "CompanyRoutes");
        this.VALIDATE_PAYLOAD = [
            body("name").isString(),
            body("color").isString(),
            body("pay_rate").isNumeric(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
        ];
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/companies`)
            .get(
                this.companyController.listCompanies.bind(
                    this.companyController
                )
            )
            .post([
                ...this.VALIDATE_PAYLOAD,
                this.companyController.createCompany.bind(
                    this.companyController
                ),
            ]);

        this.app.param(
            `company_id`,
            this.companyMiddleware.extractCompanyId.bind(this.companyMiddleware)
        );
        this.app
            .route(`/companies/:company_id`)
            .all(
                this.companyMiddleware.validateCompanyExists.bind(
                    this.companyMiddleware
                )
            )
            .get(
                this.companyController.getCompanyById.bind(
                    this.companyController
                )
            )
            .delete(
                this.companyController.removeCompany.bind(
                    this.companyController
                )
            )
            .put([
                ...this.VALIDATE_PAYLOAD,
                this.companyController.put.bind(this.companyController),
            ])
            .patch([
                ...this.VALIDATE_PAYLOAD,
                this.companyController.patch.bind(this.companyController),
            ]);

        return this.app;
    }
}
