import express from "express";
import CompanyService from "../services/company.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:company-middleware");

class CompaynMiddleware {
    private companyService: CompanyService = new CompanyService();
    async validateCompanyExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const company = await this.companyService.readById(
            req.params.company_id
        );

        if (company.success) {
            next();
        } else {
            res.status(company.statusCode).send(company);
        }
    }

    async extractCompanyId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.company_id = req.params.company_id;
        next();
    }
}

export default CompaynMiddleware;
