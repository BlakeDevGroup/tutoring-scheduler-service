import { CommonRoutesConfig } from "../../common/common.routes.config";
import CalendarController from "../controllers/calendar.controller";
import express from "express";
import { Router } from "express";
import CalendarMiddleware from "../middleware/calendar.middleware";

import EventRouter from "../../events/routes/event.router";
import SeriesRouter from "../../series/routes/series.router";
import { body } from "express-validator";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";

export default class CalendarRoutes extends CommonRoutesConfig {
    private calendarController: CalendarController = new CalendarController();
    private calendarMiddleware: CalendarMiddleware = new CalendarMiddleware();
    private VALIDATE_PAYLOAD: any[];
    constructor(app: express.Application) {
        super(app, "CalendarRoutes");

        this.VALIDATE_PAYLOAD = [
            body("name").isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
        ];
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/calendars`)
            .get(
                this.calendarController.ListCalendars.bind(
                    this.calendarController
                )
            )
            .post([
                ...this.VALIDATE_PAYLOAD,
                this.calendarController.createCalendar.bind(
                    this.calendarController
                ),
            ]);

        this.app.param(
            `calendar_id`,
            this.calendarMiddleware.extractCalendarId.bind(
                this.calendarMiddleware
            )
        );
        this.app
            .route(`/calendars/:calendar_id`)
            .all(
                this.calendarMiddleware.validateCalendarExists.bind(
                    this.calendarMiddleware
                )
            )
            .get(
                this.calendarController.getCalendarById.bind(
                    this.calendarController
                )
            )
            .delete(
                this.calendarController.removeCalendar.bind(
                    this.calendarController
                )
            )
            .put([
                ...this.VALIDATE_PAYLOAD,
                this.calendarController.put.bind(this.calendarController),
            ])
            .patch([
                ...this.VALIDATE_PAYLOAD,
                this.calendarController.patch.bind(this.calendarController),
            ]);

        this.app.use(`/calendars/:calendar_id`, [
            this.calendarMiddleware.validateCalendarExists.bind(
                this.calendarMiddleware
            ),
            new EventRouter().configureRouter(),
        ]);
        this.app.use(`/calendars/:calendar_id`, [
            this.calendarMiddleware.validateCalendarExists.bind(
                this.calendarMiddleware
            ),
            new SeriesRouter().configureRouter(),
        ]);

        return this.app;
    }
}
