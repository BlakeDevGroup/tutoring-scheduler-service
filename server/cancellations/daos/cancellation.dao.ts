import { CreateCancellationDto } from "../dtos/create.cancellation.dto";
import { PatchCancellationDto } from "../dtos/patch.cancellation.dto";
import { PutCancellationDto } from "../dtos/put.cancellation.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";
import {
    sendFailure,
    sendSuccess,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

const log: debug.IDebugger = debug("app:cancellation-dao");

class CancellationDao {
    private tableName = "ts.cancellations";

    constructor() {
        log("Created new instance of CancellationDao");
    }

    async addCancellation(
        cancellation: CreateCancellationDto
    ): Promise<ServerResponsePayload> {
        const sql = `INSERT INTO "${this.tableName}" (amount, reason, source, id, excluded_dates) VALUES ($1, $2, $3, $4, $5)`;
        try {
            const { rows } = await query(sql, [
                cancellation.amount,
                cancellation.reason,
                cancellation.source,
                cancellation.id,
                cancellation.excluded_dates,
            ]);

            return sendSuccess("Successfully created cancellation", [], 201);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCancellations(): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}"`;

        try {
            const { rows } = await query(sql, []);

            return sendSuccess("Successfully retrieved cancellations", rows);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCancellationById(
        cancellationId: string
    ): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE cancellation_id = $1`;
        try {
            const { rows } = await query(sql, [cancellationId]);

            if (rows.length > 0) {
                return sendSuccess(
                    "Successfully retrieved cancellation",
                    rows[0]
                );
            } else {
                const ERROR_MESSAGE = `No cancellation found with id: ${cancellationId}`;
                return sendFailure(
                    ERROR_MESSAGE,
                    new Error(ERROR_MESSAGE),
                    404
                );
            }
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async putCancellationById(
        cancellationId: string,
        cancellation: PutCancellationDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET amount = $2, reason = $3, source = $4, id = $5, excluded_dates = $6 WHERE cancellation_id = $1`;

        try {
            const { rows } = await query(sql, [
                cancellationId,
                cancellation.amount,
                cancellation.reason,
                cancellation.source,
                cancellation.id,
                cancellation.excluded_dates,
            ]);

            return sendSuccess(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: cancellationId },
                    cancellation
                )
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async patchCancellationById(
        cancellationId: string,
        cancellation: PatchCancellationDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET amount = $2, reason = $3, source = $4, id = $5, excluded_dates = $6 WHERE cancellation_id = $1`;

        try {
            const { rows } = await query(sql, [
                cancellationId,
                cancellation.amount,
                cancellation.reason,
                cancellation.source,
                cancellation.id,
                cancellation.excluded_dates,
            ]);

            return sendSuccess(
                "Successfully updated cancellation",
                Object.assign(
                    {},
                    { cancellation_id: cancellationId },
                    cancellation
                )
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async removeCancellationById(cancellationId: string) {
        const sql = `DELETE FROM "${this.tableName}" WHERE cancellation_id = $1`;
        try {
            await query(sql, [cancellationId]);

            return sendSuccess("Successfully removed cancellation");
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }
}

export default CancellationDao;
