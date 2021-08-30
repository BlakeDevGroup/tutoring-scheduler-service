import { CreateCancellationDto } from "../dtos/create.cancellation.dto";
import { PatchCancellationDto } from "../dtos/patch.cancellation.dto";
import { PutCancellationDto } from "../dtos/put.cancellation.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";

const log: debug.IDebugger = debug("app:cancellation-dao");

class CancellationDao {
    private tableName = "ts.cancellations";

    constructor() {
        log("Created new instance of CancellationDao");
    }

    async addCancellation(cancellation: CreateCancellationDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (amount, reason, event_id)
            VALUES ($1, $2, $3)
        `;

        const { rows } = await query(sql, [
            cancellation.amount,
            cancellation.reason,
            cancellation.event_id,
        ]);

        return rows[0];
    }

    async getCancellations(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getCancellationById(cancellationId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE cancellation_id = $1
        `;

        const { rows } = await query(sql, [cancellationId]);

        return rows[0];
    }

    async putCancellationById(
        cancellationId: string,
        cancellation: PutCancellationDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET amount = $2, reason = $2, event_id = $3
            WHERE cancellation_id = $1
        `;

        const { rows } = await query(sql, [
            cancellationId,
            cancellation.amount,
            cancellation.reason,
            cancellation.event_id,
        ]);

        return rows[0];
    }

    async patchCancellationById(
        cancellationId: string,
        cancellation: PatchCancellationDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET amount = $2, reason = $2, event_id = $3
            WHERE cancellation_id = $1
        `;

        const { rows } = await query(sql, [
            cancellationId,
            cancellation.amount,
            cancellation.reason,
            cancellation.event_id,
        ]);

        return rows[0];
    }

    async removeCancellationById(cancellationId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE cancellation_id = $1
        `;

        return await query(sql, [cancellationId]);
    }
}

export default new CancellationDao();
