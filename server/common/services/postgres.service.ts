import { Pool, PoolConfig } from "pg";
import { postgresConfig, postGresConfigTesting } from "../common.configs";

let config: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};

const pool = new Pool(config);

const testQuery = async (text: string, params: any) => {
    const client = await pool.connect();

    await client.query("BEGIN");
    const results = await client.query(text, params);
    await client.query("ROLLBACK");
    client.release();
    return results;
};

export function query(text: string, params: any): any {
    if (
        process.env.NODE_ENV?.toUpperCase() == "DEVELOPMENT" ||
        process.env.NODE_ENV?.toUpperCase() == "PRODUCTION"
    )
        return pool.query(text, params);

    if (process.env.NODE_ENV?.toUpperCase() == "TEST")
        return testQuery(text, params);
}
