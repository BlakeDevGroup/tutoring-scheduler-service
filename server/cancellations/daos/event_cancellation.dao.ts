import { CreateEventCancellationDto } from "../dtos/create.event_cancellation.dto";
import { PutEventCancellationDto } from "../dtos/put.event_cancellation.dto";
import { PatchEventCancellationDto } from "../dtos/patch.event_cancellation.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import {
    sendFailure,
    sendSuccess,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

export default class EventCancellationDao {
    private tableName = "ts.event_cancellations";
    constructor() {}

    async getCancellations(): Promise<ServerResponsePayload> {
        const SQL = `SELECT * FROM "${this.tableName}"`;
        try {
            const { rows } = await query(SQL, []);

            return sendSuccess(
                "Successfully retrieved event cancellations",
                rows
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCancellationById(
        cancellation_id: string
    ): Promise<ServerResponsePayload> {
        const SQL = `SELECT * FROM "ts.event_cancellations" WHERE cancellation_id = $1`;
        try {
            const { rows } = await query(SQL, [cancellation_id]);

            if (rows.length > 0)
                return sendSuccess(
                    "Successfully retrieved event cancellation",
                    rows[0]
                );
            else {
                const ERROR_MESSAGE = `No event cancellation found with id: ${cancellation_id}`;
                return sendFailure(
                    ERROR_MESSAGE,
                    new Error(ERROR_MESSAGE),
                    404
                );
            }
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCancellationsByEventId(
        event_id: string
    ): Promise<ServerResponsePayload> {
        const SQL = `SELECT * FROM "ts.event_cancellations" WHERE event_id = $1`;
        try {
            const { rows } = await query(SQL, [event_id]);

            if (rows.length > 0)
                return sendSuccess(
                    "Successfully retrieved event cancellations",
                    rows
                );
            else {
                const ERROR_MESSAGE = `No cancellation associated with event_id: ${event_id}`;
                return sendFailure(
                    ERROR_MESSAGE,
                    new Error(ERROR_MESSAGE),
                    404
                );
            }
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async createEventCancellation(
        resource: CreateEventCancellationDto
    ): Promise<ServerResponsePayload> {
        const SQL = `INSERT INTO "${this.tableName}" (event_id, reason) VALUES ($1, $2)`;

        try {
            await query(SQL, [resource.event_id, resource.reason]);

            return sendSuccess(
                "Successfully created event cancellation",
                [],
                201
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async putEventCancellation(
        cancellation_id: string,
        resource: PutEventCancellationDto
    ): Promise<ServerResponsePayload> {
        const SQL = `UPDATE "ts.event_cancellations" SET event_id = $2, reason = $3 WHERE cancellation_id = $1`;
        try {
            await query(SQL, [
                cancellation_id,
                resource.event_id,
                resource.reason,
            ]);
            return sendSuccess("Successfully updated cancellation", {
                cancellation_id: cancellation_id,
                event_id: resource.event_id,
                reason: resource.reason,
            });
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async patchEventCancellation(
        cancellation_id: string,
        resource: PatchEventCancellationDto
    ): Promise<ServerResponsePayload> {
        const SQL = `UPDATE "ts.event_cancellations" SET event_id = $2, reason = $3 WHERE cancellation_id = $1`;
        try {
            await query(SQL, [
                cancellation_id,
                resource.event_id,
                resource.reason,
            ]);
            return sendSuccess("Successfully updated cancellation", {
                cancellation_id: cancellation_id,
                event_id: resource.event_id,
                reason: resource.reason,
            });
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async deleteEventCancellation(
        cancellation_id: string
    ): Promise<ServerResponsePayload> {
        const SQL = `DELETE FROM "ts.event_cancellations" WHERE cancellation_id = $1`;
        try {
            await query(SQL, [cancellation_id]);
            return sendSuccess("Successfully removed event cancellation", []);
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }
}
