import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateCompanyDto } from "../dtos/create.company.dto";
import { PatchCompanyDto } from "../dtos/patch.company.dto";
import { PutCompanyDto } from "../dtos/put.company.dto";
import companyDao from "../daos/company.dao";

class CompanyService implements CRUD {
    async create(resource: CreateCompanyDto) {
        return companyDao.addCompany(resource);
    }

    async deleteById(id: string) {
        return companyDao.removeCompanyById(id);
    }

    async list(limit: number, page: number) {
        return companyDao.getCompanies();
    }

    async patchById(id: string, resource: PatchCompanyDto) {
        return companyDao.patchCompanyById(id, resource);
    }

    async putById(id: string, resource: PutCompanyDto) {
        return companyDao.putCompanyById(id, resource);
    }

    async readById(id: string) {
        return companyDao.getCompanyById(id);
    }
}

export default new CompanyService();
