import { CommonRoutesConfig } from "../common/common.routes.config";
import CalendarController from "./controllers/calendar.controller";
import express from "express";
import CalendarMiddleware from "./middleware/calendar.middleware";

export class CalendarRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CalendarRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/calendars`)
            .get(CalendarController.ListCalendars)
            .post(CalendarController.createCalendar);

        this.app.param(`calendarId`, CalendarMiddleware.extractCalendarId);
        this.app
            .route(`/calendars/:calendarId`)
            .get(CalendarController.getCalendarById)
            .delete(CalendarController.removeCalendar);

        this.app.put(`/calendars/:calendarId`, [CalendarController.put]);
        this.app.patch(`/calendars/:calendarId`, [CalendarController.patch]);

        return this.app;
    }
}
