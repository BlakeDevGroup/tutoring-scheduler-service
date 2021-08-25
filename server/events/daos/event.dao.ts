import { CreateEventDto } from "../dtos/create.event.dto";
import { PatchEventDto } from "../dtos/patch.event.dto";
import { PutEventDto } from "../dtos/put.event.dto";
import debug from "debug";
import { query } from "../../common/services/postgres";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:event-dao`);

export default class EventDao {
    private tableName = "ts.events";
    constructor() {
        log("Created new instance of EventDao");
        console.log("Created new instance of EventDao");
    }

    async addEvent(event: CreateEventDto) {
        const sql = `INSERT INTO "${this.tableName}" (date_start, date_end, title, all_day, calendar_id) VALUES ($1, $2, $3, $4, $5)`;
        try {
            const { rows } = await query(sql, [
                event.dateStart,
                event.dateEnd,
                event.title,
                event.allDay,
                event.calendarId,
                event.userId,
            ]);
            return rows;
        } catch (error) {
            return error;
        }
    }

    async getEvents() {
        const sql = `SELECT * FROM "${this.tableName}" WHERE calendar_id = $1`;
        try {
            const { rows } = await query(sql, []);

            return rows;
        } catch (error) {
            return error;
        }
    }

    async getEventsByCalendarId(calendarId: number) {
        const sql = `SELECT * FROM "${this.tableName}" WHERE calendar_id = $1`;

        try {
            const { rows } = await query(sql, [calendarId]);

            return rows;
        } catch (error) {
            return error;
        }
    }

    async getEventById(eventId: string) {
        const sql = `SELECT * FROM "${this.tableName}" WHERE event_id = $1`;
        try {
            const { rows } = await query(sql, [eventId]);

            return rows[0];
        } catch (error) {
            return error;
        }
    }

    async putEventById(eventId: string, event: PutEventDto) {
        const sql = `UPDATE "${this.tableName}" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6 WHERE calendar_id = $7 and event_id = $1`;
        try {
            const { rows } = await query(sql, [
                eventId,
                event.dateStart,
                event.dateEnd,
                event.title,
                event.allDay,
                event.userId,
                event.calendarId,
            ]);

            return rows;
        } catch (error) {
            return error;
        }
    }

    async patchEventById(eventId: string, event: PatchEventDto) {
        const sql = `UPDATE "${this.tableName}" SET date_start = $2, date_end = $3, title = $4, all_day = $5, user_id = $6 WHERE calendar_id = $7 and event_id = $1`;
        try {
            const { rows } = await query(sql, [
                eventId,
                event.dateStart,
                event.dateEnd,
                event.title,
                event.allDay,
                event.userId,
                event.calendarId,
            ]);

            return rows[0];
        } catch (error) {
            return error;
        }
    }

    async removeEventById(eventId: string) {
        const sql = `DELETE FROM "${this.tableName}" WHERE event_id = $1`;
        try {
            return await query(sql, [eventId]);
        } catch (error) {
            return error;
        }
    }
}
