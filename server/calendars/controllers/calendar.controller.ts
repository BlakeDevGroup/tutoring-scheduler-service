import express from "express";
import CalendarService from "../services/calendar.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:calendar-controller");

class CalendarController {
    async ListCalendars(req: express.Request, res: express.Response) {
        const calendars = await CalendarService.list(100, 0);

        res.status(200).send(calendars);
    }

    async getCalendarById(req: express.Request, res: express.Response) {
        const calendar = await CalendarService.readById(req.body.calendarId);

        res.status(200).send(calendar);
    }

    async createCalendar(req: express.Request, res: express.Response) {
        const calendar = await CalendarService.create(req.body);

        res.status(200).send(calendar);
    }

    async patch(req: express.Request, res: express.Response) {
        log(await CalendarService.patchById(req.body.calendarId, req.body));

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await CalendarService.deleteById(req.body.calendarId));

        res.status(204).send();
    }

    async removeCalendar(req: express.Request, res: express.Response) {
        log(await CalendarService.deleteById(req.body.calendarId));

        res.status(204).send();
    }
}

export default new CalendarController();
