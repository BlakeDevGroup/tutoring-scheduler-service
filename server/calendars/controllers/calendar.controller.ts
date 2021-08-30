import express from "express";
import CalendarService from "../services/calendar.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:calendar-controller");

class CalendarController {
    private calendarService: CalendarService = new CalendarService();
    async ListCalendars(req: express.Request, res: express.Response) {
        const calendars = await this.calendarService.list(100, 0);

        res.status(calendars.statusCode).send(calendars);
    }

    async getCalendarById(req: express.Request, res: express.Response) {
        const calendar = await this.calendarService.readById(
            req.body.calendar_id
        );

        res.status(calendar.statusCode).send(calendar);
    }

    async createCalendar(req: express.Request, res: express.Response) {
        const calendar = await this.calendarService.create(req.body);

        res.status(calendar.statusCode).send(calendar);
    }

    async patch(req: express.Request, res: express.Response) {
        const calendar = await this.calendarService.patchById(
            req.body.calendar_id,
            req.body
        );

        res.status(calendar.statusCode).send(calendar);
    }

    async put(req: express.Request, res: express.Response) {
        const calendar = await this.calendarService.putById(
            req.body.calendar_id,
            req.body
        );

        res.status(calendar.statusCode).send(calendar);
    }

    async removeCalendar(req: express.Request, res: express.Response) {
        const response = await this.calendarService.deleteById(
            req.body.calendar_id
        );

        res.status(response.statusCode).send(response);
    }
}

export default CalendarController;
