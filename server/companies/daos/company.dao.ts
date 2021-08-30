import { CreateCompanyDto } from "../dtos/create.company.dto";
import { PatchCompanyDto } from "../dtos/patch.company.dto";
import { PutCompanyDto } from "../dtos/put.company.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";

const log: debug.IDebugger = debug("app:company-dao");

class CompanyDao {
    private tableName = "ts.companies";

    constructor() {
        log("Created new instance of CompanyDao");
    }

    async addCompany(company: CreateCompanyDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (name, pay_rate)
            VALUES ($1, $2)
        `;

        const { rows } = await query(sql, [company.name, company.pay_rate]);

        return rows[0];
    }

    async getCompanies(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getCompanyById(companyId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE company_id = $1
        `;

        const { rows } = await query(sql, [companyId]);

        return rows[0];
    }

    async putCompanyById(
        companyId: string,
        company: PutCompanyDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET name = $2, pay_rate = $3
            WHERE company_id = $1
        `;

        const { rows } = await query(sql, [
            companyId,
            company.name,
            company.pay_rate,
        ]);

        return rows[0];
    }

    async patchCompanyById(
        companyId: string,
        company: PatchCompanyDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET name = $2, pay_rate = $3
            WHERE company_id = $1
        `;

        const { rows } = await query(sql, [
            companyId,
            company.name,
            company.pay_rate,
        ]);

        return rows[0];
    }

    async removeCompanyById(companyId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE company_id = $1
        `;

        return await query(sql, [companyId]);
    }
}

export default new CompanyDao();
