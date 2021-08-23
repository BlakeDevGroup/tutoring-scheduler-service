import { CreateSeriesDto } from "../dtos/create.series.dto";
import { PatchSeriesDto } from "../dtos/patch.series.dto";
import { PutSeriesDto } from "../dtos/put.series.dto";
import debug from "debug";
import { query } from "../../common/services/postgres";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:series-dao`);

class SeriesDao {
    private tableName = "ts.series";

    constructor() {
        log("Created new instance of SeriesDao");
    }

    async addSeries(series: CreateSeriesDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (title, description, recurrence, start, end, series_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const { rows } = await query(sql, [
            series.title,
            series.description,
            series.recurrence,
            series.start,
            series.end,
            series.calendarId,
        ]);

        return rows[0];
    }

    async getSeries(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getSeriesById(seriesId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE series_id = $1
        `;

        const { rows } = await query(sql, [seriesId]);

        return rows[0];
    }

    async putSeriesById(
        seriesId: string,
        series: PutSeriesDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET title = $2, description = $3, recurrence = $4, start = $5, 
            end = $6, calendar_id = $7
            WHERE series_id = $1
        `;

        const { rows } = await query(sql, [
            seriesId,
            series.title,
            series.description,
            series.recurrence,
            series.start,
            series.end,
            series.calendarId,
        ]);

        return rows[0];
    }

    async patchSeriesById(
        seriesId: string,
        series: PatchSeriesDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET title = $2, description = $3, recurrence = $4, start = $5, 
            end = $6, calendar_id = $7
            WHERE series_id = $1
        `;

        const { rows } = await query(sql, [
            seriesId,
            series.title,
            series.description,
            series.recurrence,
            series.start,
            series.end,
            series.calendarId,
        ]);

        return rows[0];
    }

    async removeSeriesById(seriesId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE series_id = $1
        `;

        return await query(sql, [seriesId]);
    }
}

export default new SeriesDao();
