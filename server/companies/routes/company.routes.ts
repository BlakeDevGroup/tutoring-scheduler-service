import { CommonRoutesConfig } from "../../common/common.routes.config";
import CompanyController from "../controllers/company.controller";
import companyMiddleware from "../middleware/company.middleware";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";

export class CompanyRoutes extends CommonRoutesConfig {
    private companyController: CompanyController = new CompanyController();
    private companyMiddleware: companyMiddleware = new companyMiddleware();
    constructor(app: express.Application) {
        super(app, "CompanyRoutes");
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
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                this.companyController.createCompany.bind(
                    this.companyController
                ),
            ]);

        this.app.param(
            `companyId`,
            this.companyMiddleware.extractCompanyId.bind(this.companyMiddleware)
        );
        this.app
            .route(`/companies/:companyId`)
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
            .put(this.companyController.put.bind(this.companyController))
            .patch(this.companyController.patch.bind(this.companyController));

        return this.app;
    }
}
