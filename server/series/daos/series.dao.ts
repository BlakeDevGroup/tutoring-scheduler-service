import { CreateSeriesDto } from "../dtos/create.series.dto";
import { PatchSeriesDto } from "../dtos/patch.series.dto";
import { PutSeriesDto } from "../dtos/put.series.dto";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";
import {
    sendFailure,
    sendSuccess,
    ServerResponsePayload,
} from "../../common/services/message/message.service";

const log: debug.IDebugger = debug(`app:series-dao`);

export default class SeriesDao {
    private tableName = "ts.series";

    constructor() {
        log("Created new instance of SeriesDao");
    }

    async addSeries(series: CreateSeriesDto): Promise<ServerResponsePayload> {
        const sql = `INSERT INTO "${this.tableName}" (title, description, calendar_id, start_time, end_time, start_recur, end_recur, days_of_week, user_id, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING series_id`;
        try {
            const { rows } = await query(sql, [
                series.title,
                series.description,
                series.calendar_id,
                series.start_time,
                series.end_time,
                series.start_recur,
                series.end_recur,
                series.days_of_week,
                series.user_id,
                series.company_id,
            ]);

            return sendSuccess(
                "Successfully created series",
                { ...series, ...rows[0] },
                201
            );
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getSeries(): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}"`;

        try {
            const { rows } = await query(sql, []);

            return sendSuccess("Successfully retrieved all series", rows);
        } catch (e: any) {
            return sendFailure(e.message, e, 500);
        }
    }

    async getSeriesById(series_id: string): Promise<ServerResponsePayload> {
        const sql = `SELECT * FROM "${this.tableName}" WHERE series_id = $1`;

        try {
            const { rows } = await query(sql, [series_id]);

            if (rows.length > 0) {
                return sendSuccess("Successfully retrieved series", rows[0]);
            } else {
                const ERROR_MESSAGE = `No series found with id: ${series_id}`;
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

    async getSeriesByIdAndCalendarId(series_id: string, calendarId: string) {
        const sql = `SELECT * FROM "${this.tableName}" WHERE series_id = $1 and calendar_id = $2`;
        try {
            const { rows } = await query(sql, [series_id, calendarId]);

            if (rows.length > 0) {
                return sendSuccess("Successfully retrieved series", rows[0]);
            } else {
                const ERROR_MESSAGE = `Series with id: ${series_id} does not exist on calendar with id: ${calendarId}`;
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

    async putSeriesById(
        series_id: string,
        series: PutSeriesDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET title = $2, description = $3, calendar_id = $4, start_time = $5, end_time = $6, start_recur = $7, end_recur = $8, days_of_week = $9, user_id = $10, company_id = $11 WHERE series_id = $1`;
        try {
            await query(sql, [
                series_id,
                series.title,
                series.description,
                series.calendar_id,
                series.start_time,
                series.end_time,
                series.start_recur,
                series.end_recur,
                series.days_of_week,
                series.user_id,
                series.company_id,
            ]);

            return sendSuccess(
                "Successfully updated series",
                Object.assign(series, { series_id: series_id })
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async patchSeriesById(
        series_id: string,
        series: PatchSeriesDto
    ): Promise<ServerResponsePayload> {
        const sql = `UPDATE "${this.tableName}" SET title = $2, description = $3, calendar_id = $4, start_time = $5, end_time = $6, start_recur = $7, end_recur = $8, days_of_week = $9, user_id = $10, company_id = $11 WHERE series_id = $1`;
        try {
            await query(sql, [
                series_id,
                series.title,
                series.description,
                series.calendar_id,
                series.start_time,
                series.end_time,
                series.start_recur,
                series.end_recur,
                series.days_of_week,
                series.user_id,
                series.company_id,
            ]);

            return sendSuccess(
                "Successfully updated series",
                Object.assign(series, { series_id: series_id })
            );
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }

    async removeSeriesById(series_id: string) {
        const sql = `DELETE FROM "${this.tableName}" WHERE series_id = $1`;
        try {
            await query(sql, [series_id]);

            return sendSuccess("Successfully removed series", [], 200);
        } catch (e) {
            return sendFailure(e.message, e, 500);
        }
    }
}
