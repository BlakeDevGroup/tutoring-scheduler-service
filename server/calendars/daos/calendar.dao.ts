import { CreateCalendarDto } from "../dtos/create.calendar.dto";
import { PatchCalendarDto } from "../dtos/patch.calendar.dto";
import { PutCalendarDto } from "../dtos/put.calendar.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";
import {
    sendFailure,
    sendSuccess,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

const log: debug.IDebugger = debug(`app:calendar-dao`);

class CalendarDao {
    private tableName = "ts.calendars";

    constructor() {
        log("Created new instance of CalendarDao");
    }

    async addCalendar(
        calendar: CreateCalendarDto
    ): Promise<ServerResponsePayload> {
        const sql = `INSERT INTO "${this.tableName}" (name) VALUES ($1)`;
        try {
            await query(sql, [calendar.name]);

            return sendSuccess("Successfully created calendar", [], 201);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCalendars(): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}"`;
        try {
            const { rows } = await query(sql, []);

            return sendSuccess("Successfully retrieved calendars", rows, 200);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getCalendarById(calendarId: string): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE calendar_id = $1`;

        try {
            const { rows } = await query(sql, [calendarId]);
            if (rows.length < 1) {
                return sendFailure(
                    `No calendar found with id: ${calendarId}`,
                    new Error(`No calendar found with id: ${calendarId}`),
                    404
                );
            } else {
                return sendSuccess(
                    "Successfully retrieved calendar",
                    rows[0],
                    200
                );
            }
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async putCalendarById(
        calendarId: string,
        calendar: PutCalendarDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET name = $2 WHERE calendar_id = $1`;
        try {
            const { rows } = await query(sql, [calendarId, calendar.name]);

            return sendSuccess(
                `Successfully updated calendar id: ${calendarId}`,
                Object.assign(calendar, { calendar_id: calendarId })
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async patchCalendarById(
        calendarId: string,
        calendar: PatchCalendarDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET name = $2 WHERE calendar_id = $1`;

        try {
            const { rows } = await query(sql, [calendarId, calendar.name]);

            return sendSuccess(
                `Successfully updated calendar id: ${calendarId}`,
                Object.assign(calendar, { calendar_id: calendarId })
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async removeCalendarById(calendarId: string) {
        const sql = `DELETE FROM "${this.tableName}" WHERE calendar_id = $1`;

        try {
            await query(sql, [calendarId]);

            return sendSuccess("Successfully removed calendar", []);
        } catch (e) {
            return sendFailure(e.message, e);
        }
    }
}

export default CalendarDao;
