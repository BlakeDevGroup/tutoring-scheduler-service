import { CreateCompanyDto } from "../dtos/create.company.dto";
import { PatchCompanyDto } from "../dtos/patch.company.dto";
import { PutCompanyDto } from "../dtos/put.company.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";
import {
    sendSuccess,
    sendFailure,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

const log: debug.IDebugger = debug("app:company-dao");

class CompanyDao {
    private tableName = "ts.companies";

    constructor() {
        log("Created new instance of CompanyDao");
    }

    async addCompany(
        company: CreateCompanyDto
    ): Promise<ServerResponsePayload> {
        const sql = `INSERT INTO "${this.tableName}" (name, pay_rate, color) VALUES ($1, $2, $3) RETURNING company_id`;
        try {
            const { rows } = await query(sql, [
                company.name,
                company.pay_rate,
                company.color,
            ]);

            return sendSuccess(
                "Successfully created company",
                { ...company, ...rows[0] },
                201
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCompanies(): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}"`;
        try {
            const { rows } = await query(sql, []);

            return sendSuccess("Successfully retrieved companies", rows);
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCompanyById(companyId: string): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE company_id = $1`;

        try {
            const { rows } = await query(sql, [companyId]);

            if (rows.length > 0) {
                return sendSuccess("Successfully retrieved company", rows[0]);
            } else {
                const ERROR_MESSAGE = `No company found with id: ${companyId}`;
                return sendFailure(
                    ERROR_MESSAGE,
                    new Error(ERROR_MESSAGE),
                    404
                );
            }
        } catch (e: any) {
            return sendFailure(e.message, e);
        }
    }

    async putCompanyById(
        companyId: string,
        company: PutCompanyDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET name = $2, pay_rate = $3, color = $4 WHERE company_id = $1`;
        try {
            await query(sql, [
                companyId,
                company.name,
                company.pay_rate,
                company.color,
            ]);

            return sendSuccess(
                "Successfully updated company",
                Object.assign(company, { company_id: companyId })
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async patchCompanyById(
        companyId: string,
        company: PatchCompanyDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET name = $2, pay_rate = $3, color = $4 WHERE company_id = $1`;
        try {
            await query(sql, [
                companyId,
                company.name,
                company.pay_rate,
                company.color,
            ]);

            return sendSuccess(
                "Successfully updated company",
                Object.assign(company, { company_id: companyId })
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async removeCompanyById(companyId: string) {
        const sql = `DELETE FROM "${this.tableName}" WHERE company_id = $1`;

        try {
            await query(sql, [companyId]);

            return sendSuccess("Successfully removed company");
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }
}

export default CompanyDao;
