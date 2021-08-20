import express from "express";
import eventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:events-controller");

class EventMiddleware {
    async validateDates(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            this.startDateIsLessThanEndDate(
                req.body.start_date,
                req.body.end_date
            )
        ) {
            next();
        } else {
            res.status(400).send({
                error: `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`,
            });
        }
    }

    private startDateIsLessThanEndDate(startDate: string, endDate: string) {
        return new Date(startDate) < new Date(endDate);
    }
}

export default new EventMiddleware();
