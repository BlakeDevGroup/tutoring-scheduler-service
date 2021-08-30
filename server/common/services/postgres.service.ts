import { Pool } from "pg";
import { postgresConfig } from "../common.configs";

const pool: Pool = new Pool(postgresConfig);

const testQuery = async (text: string, params: any) => {
    const client = await pool.connect();

    await client.query("BEGIN");
    const results = await client.query(text, params);
    await client.query("ROLLBACK");
    client.release();
    return results;
};

export function query(text: string, params: any): any {
    if (process.env.APP == "dev" || process.env.APP == "prod")
        return pool.query(text, params);

    if (process.env.APP == "test") return testQuery(text, params);
}
