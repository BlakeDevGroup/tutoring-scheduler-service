import { Pool } from "pg";
import { postgresConfig } from "../common.configs";

const pool = new Pool(postgresConfig);

export function query(text: string, params: any): any {
    return pool.query(text, params);
}
