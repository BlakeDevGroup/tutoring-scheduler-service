import express from "express";
import companyServices from "../services/company.services";
import debug from "debug";

const log: debug.IDebugger = debug("add:company-controller");

class CompanyController {
    async listCompanies(req: express.Request, res: express.Response) {
        const companies = await companyServices.list(100, 0);

        res.status(200).send(companies);
    }

    async getCompanyById(req: express.Request, res: express.Response) {
        const company = await companyServices.readById(req.body.companyId);

        res.status(200).send(company);
    }

    async createCompany(req: express.Request, res: express.Response) {
        const company = await companyServices.create(req.body);

        res.status(200).send(company);
    }

    async patch(req: express.Request, res: express.Response) {
        log(await companyServices.patchById(req.body.companyId, req.body));

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await companyServices.putById(req.body.companyId, req.body));

        res.status(204).send();
    }

    async removeCompany(req: express.Request, res: express.Response) {
        log(await companyServices.deleteById(req.body.companyId));

        res.status(204).send();
    }
}

export default new CompanyController();
