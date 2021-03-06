import { CreateEventDto } from "../dtos/create.event.dto";
import { PatchEventDto } from "../dtos/patch.event.dto";
import { PutEventDto } from "../dtos/put.event.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";
import {
    sendSuccess,
    sendFailure,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

const log: debug.IDebugger = debug(`app:event-dao`);

export default class EventDao {
    private tableName = "ts.events";
    constructor() {
        log("Created new instance of EventDao");
    }

    async addEvent(event: CreateEventDto): Promise<ServerResponsePayload> {
        const sql = `INSERT INTO "${this.tableName}" (date_start, date_end, title, all_day, calendar_id, user_id, description, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id`;
        try {
            const { rows } = await query(sql, [
                event.date_start,
                event.date_end,
                event.title,
                event.all_day,
                event.calendar_id,
                event.user_id,
                event.description,
                event.company_id,
            ]);

            return sendSuccess(
                "Event created successfully",
                { ...event, ...rows[0] },
                201
            );
        } catch (e: any) {
            return sendFailure(e.message, e);
        }
    }

    async getEvents(): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE calendar_id = $1`;
        try {
            const { rows } = await query(sql, []);

            return sendSuccess("Successfully retrieved events", rows);
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }

    async getEventsByCalendarId(
        calendarId: string
    ): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE calendar_id = $1`;

        try {
            const { rows } = await query(sql, [calendarId]);

            return sendSuccess("Successfully retrieved events", rows);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getEventByCalendarId(
        eventId: string,
        calendarId: string
    ): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "ts.events" WHERE event_id = $1 and calendar_id = $2`;
        try {
            const { rows } = await query(sql, [eventId, calendarId]);

            if (rows.length > 0) {
                return sendSuccess("Successfully retrieved event", rows[0]);
            } else {
                const ERROR_MESSAGE = `Event with id: ${eventId} does not exist on calendar with id: ${calendarId}`;
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

    async getEventById(eventId: string): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE event_id = $1`;
        try {
            const { rows } = await query(sql, [eventId]);
            if (rows.length < 1) {
                return sendFailure(
                    `No event found with id: ${eventId}`,
                    new Error(`No event found with id: ${eventId}`),
                    404
                );
            } else {
                return sendSuccess("Successfully retrieved event", rows[0]);
            }
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }

    async putEventById(
        eventId: string,
        event: PutEventDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6, description = $8, company_id = $9 WHERE calendar_id = $7 and event_id = $1`;
        try {
            const { rows } = await query(sql, [
                eventId,
                event.date_start,
                event.date_end,
                event.title,
                event.all_day,
                event.user_id,
                event.calendar_id,
                event.description,
                event.company_id,
            ]);

            return sendSuccess(
                `Successfully updated event id: ${eventId}`,
                Object.assign(event, { event_id: eventId })
            );
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }

    async patchEventById(
        eventId: string,
        event: PatchEventDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6, description = $8, company_id = $9 WHERE calendar_id = $7 and event_id = $1`;
        try {
            const { rows } = await query(sql, [
                eventId,
                event.date_start,
                event.date_end,
                event.title,
                event.all_day,
                event.user_id,
                event.calendar_id,
                event.description,
                event.company_id,
            ]);

            return sendSuccess(
                `Successfully patched event id: ${eventId}`,
                Object.assign(event, { event_id: eventId })
            );
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }

    async removeEventById(eventId: string): Promise<ServerResponsePayload> {
        const sql = `DELETE FROM "${this.tableName}" WHERE event_id = $1`;
        try {
            await query(sql, [eventId]);

            return sendSuccess(`Successfully removed event`);
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }
}
