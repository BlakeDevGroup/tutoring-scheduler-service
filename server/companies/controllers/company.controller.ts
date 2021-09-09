import express from "express";
import CompanyServices from "../services/company.service";
import debug from "debug";

const log: debug.IDebugger = debug("add:company-controller");

class CompanyController {
    private companyService: CompanyServices = new CompanyServices();
    async listCompanies(req: express.Request, res: express.Response) {
        const companies = await this.companyService.list(100, 0);

        res.status(companies.statusCode).send(companies);
    }

    async getCompanyById(req: express.Request, res: express.Response) {
        const company = await this.companyService.readById(req.body.company_id);

        res.status(company.statusCode).send(company);
    }

    async createCompany(req: express.Request, res: express.Response) {
        const company = await this.companyService.create(req.body);

        res.status(company.statusCode).send(company);
    }

    async patch(req: express.Request, res: express.Response) {
        const company = await this.companyService.patchById(
            req.body.company_id,
            req.body
        );

        res.status(company.statusCode).send(company);
    }

    async put(req: express.Request, res: express.Response) {
        const company = await this.companyService.putById(
            req.body.company_id,
            req.body
        );

        res.status(company.statusCode).send(company);
    }

    async removeCompany(req: express.Request, res: express.Response) {
        const company = await this.companyService.deleteById(
            req.body.company_id
        );

        res.status(company.statusCode).send(company);
    }
}

export default CompanyController;
