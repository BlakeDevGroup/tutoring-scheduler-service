import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateCompanyDto } from "../dtos/create.company.dto";
import { PatchCompanyDto } from "../dtos/patch.company.dto";
import { PutCompanyDto } from "../dtos/put.company.dto";
import CompanyDao from "../daos/company.dao";

class CompanyService implements CRUD {
    private companyDao: CompanyDao = new CompanyDao();
    async create(resource: CreateCompanyDto) {
        return this.companyDao.addCompany(resource);
    }

    async deleteById(id: string) {
        return this.companyDao.removeCompanyById(id);
    }

    async list(limit: number, page: number) {
        return this.companyDao.getCompanies();
    }

    async patchById(id: string, resource: PatchCompanyDto) {
        return this.companyDao.patchCompanyById(id, resource);
    }

    async putById(id: string, resource: PutCompanyDto) {
        return this.companyDao.putCompanyById(id, resource);
    }

    async readById(id: string) {
        return this.companyDao.getCompanyById(id);
    }
}

export default CompanyService;
