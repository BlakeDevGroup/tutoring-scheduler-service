import express from "express";
import CalendarService from "../services/calendar.service";
import debug from "debug";
import calendarService from "../services/calendar.service";
import { sendFailure } from "../../common/services/message/message.service";

const log: debug.IDebugger = debug("app:calendar-middleware");

class CalendarMiddleware {
    private calendarService: CalendarService = new CalendarService();
    async extractCalendarId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.calendar_id = req.params.calendar_id;
        next();
    }

    async validateCalendarExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const calendar = await this.calendarService.readById(
            req.params.calendar_id
        );

        if (calendar.success) {
            next();
        } else {
            res.status(calendar.statusCode).send(calendar);
        }
    }
}

export default CalendarMiddleware;
