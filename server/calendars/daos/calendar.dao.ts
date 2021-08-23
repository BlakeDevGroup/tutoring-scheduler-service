import { CreateCalendarDto } from "../dtos/create.calendar.dto";
import { PatchCalendarDto } from "../dtos/patch.calendar.dto";
import { PutCalendarDto } from "../dtos/put.calendar.dto";
import debug from "debug";
import { query } from "../../common/services/postgres";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:calendar-dao`);

class CalendarDao {
    private tableName = "ts.calendars";

    constructor() {
        log("Cretaed new instance of CalendarDao");
    }

    async addCalendar(calendar: CreateCalendarDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (name)
            VALUES ($1)
        `;
        const { rows } = await query(sql, [calendar.name]);

        return rows[0];
    }

    async getCalendars(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getCalendarById(calendarId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE calendar_id = $1
        `;

        const { rows } = await query(sql, [calendarId]);

        return rows;
    }

    async putCalendarById(
        calendarId: string,
        calendar: PutCalendarDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET name = $2
            WHERE calendar_id = $1
        `;

        const { rows } = await query(sql, [calendarId, calendar.name]);

        return rows[0];
    }

    async patchCalendarById(
        calendarId: string,
        calendar: PatchCalendarDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET name = $2
            WHERE calendar_id = $1
        `;

        const { rows } = await query(sql, [calendar.name]);

        return rows[0];
    }

    async removeCalendarById(calendarId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE calendar_id = $1        
        `;

        return await query(sql, [calendarId]);
    }
}

export default new CalendarDao();
