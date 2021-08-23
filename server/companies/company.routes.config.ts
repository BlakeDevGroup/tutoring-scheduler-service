import { CommonRoutesConfig } from "../common/common.routes.config";
import companyController from "./controllers/company.controller";
import companyMiddleware from "./middleware/company.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";

export class CompanyRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CompanyRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/companies`)
            .get(companyController.listCompanies)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                companyController.createCompany,
            ]);

        this.app.param(`companyId`, companyMiddleware.extractCompanyId);
        this.app
            .route(`/companies/:companyId`)
            .all(companyMiddleware.validateCompanyExists)
            .get(companyController.getCompanyById)
            .delete(companyController.removeCompany)
            .put(companyController.put)
            .patch(companyController.patch);

        return this.app;
    }
}
