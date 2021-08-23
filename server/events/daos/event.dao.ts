import { CreateEventDto } from "../dtos/create.event.dto";
import { PatchEventDto } from "../dtos/patch.event.dto";
import { PutEventDto } from "../dtos/put.event.dto";
import debug from "debug";
import { query } from "../../common/services/postgres";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:event-dao`);

class EventDao {
    private tableName = "ts.events";
    constructor() {
        log("Created new instance of EventDao");
    }

    async addEvent(event: CreateEventDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (date_start, date_end, title, all_day)
            VALUES ($1, $2, $3, $4)
        `;

        const { rows } = await query(sql, [
            event.dateStart,
            event.dateEnd,
            event.title,
            event.allDay,
        ]);

        return rows[0];
    }

    async getEvents(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getEventById(eventId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE event_id = $1
        `;

        const { rows } = await query(sql, [eventId]);

        return rows[0];
    }

    async putEventById(eventId: string, event: PutEventDto): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET date_start = $2, date_end = $3, title = $4, all_day = $5
            WHERE event_id = $1
        `;

        const { rows } = await query(sql, [
            eventId,
            event.dateStart,
            event.dateEnd,
            event.title,
            event.allDay,
        ]);

        return rows[0];
    }

    async patchEventById(
        eventId: string,
        event: PatchEventDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET date_start = $2, date_end = $3, all_day = $4, title = $5
            WHERE event_id = $1
        `;

        const { rows } = await query(sql, [
            eventId,
            event.dateStart,
            event.dateEnd,
            event.allDay,
            event.title,
        ]);

        return rows[0];
    }

    async removeEventById(eventId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE event_id = $1
        `;

        return await query(sql, [eventId]);
    }
}

export default new EventDao();
