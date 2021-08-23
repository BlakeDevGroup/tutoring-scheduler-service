import express from "express";
import CalendarService from "../services/calendar.service";
import debug from "debug";
import calendarService from "../services/calendar.service";

const log: debug.IDebugger = debug("app:calendar-middleware");

class CalendarMiddleware {
    async extractCalendarId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.calendarId = req.params.calendarId;
        next();
    }

    async validateCalendarExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const calendar = await calendarService.readById(req.params.calendarId);

        if (calendar) {
            next();
        } else {
            res.status(404).send({
                error: `Caeldnar ${req.params.calendarId} not found`,
            });
        }
    }
}

export default new CalendarMiddleware();
