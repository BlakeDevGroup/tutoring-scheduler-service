import express, { request } from "express";
import SeriesService from "../services/series.service";
import debug from "debug";
import { sendFailure } from "../../common/services/message/message.service";
import { TypedRule } from "tslint/lib/rules";

const log: debug.IDebugger = debug("app:series-middleware");

class SeriesMiddleware {
    private seriesService: SeriesService = new SeriesService();
    async validateSeriesExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const series = await this.seriesService.readByIdAndCalendarId(
            req.params.series_id,
            req.body.calendar_id
        );

        if (series.success) {
            next();
        } else {
            res.status(series.statusCode).send(series);
        }
    }

    async extractSeriesId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.series_id = req.params.series_id;
        next();
    }

    datesAreValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            new Date(
                `${req.body.start_recur}T${req.body.start_time}`
            ).getTime() <
            new Date(`${req.body.end_recur}T${req.body.end_time}`).getTime()
        ) {
            next();
        } else {
            const ERROR_MESSAGE = `Start datetime ${req.body.start_recur}T${req.body.start_time} occurs after end datetime ${req.body.end_recur}T${req.body.end_time}`;
            res.status(400).send(
                sendFailure(ERROR_MESSAGE, new Error(ERROR_MESSAGE))
            );
        }
    }

    validateTime(time: string) {
        return RegExp(/[0-9]{2}:[0-9]{2}/g).test(time);
    }

    validateDate(date: string) {
        return RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g).test(date);
    }

    /**
     * if date evaluates as false true
     * otherwise, validate string is dateString
     * @param date
     */
    validateDateEnd(date: string | undefined | null) {
        if (date) return this.validateDate(date);
        else return true;
    }
}

export default SeriesMiddleware;
