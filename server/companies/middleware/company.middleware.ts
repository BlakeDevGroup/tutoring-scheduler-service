import express from "express";
import companyServices from "../services/company.services";
import debug from "debug";

const log: debug.IDebugger = debug("app:company-middleware");

class CompaynMiddleware {
    async validateCompanyExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const company = await companyServices.readById(req.params.companyId);

        if (company) {
            next();
        } else {
            res.status(404).send({
                error: `Company ${req.params.companyId} not found`,
            });
        }
    }

    async extractCompanyId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.companyId = req.params.companyId;
        next();
    }
}

export default new CompaynMiddleware();
