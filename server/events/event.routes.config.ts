import { CommonRoutesConfig } from "../common/common.routes.config";
import EventsController from "./controllers/event.controller";
import eventsMiddleware from "./middleware/event.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";

export class EventRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "EventRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/events`)
            .get(EventsController.listEvents)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                eventsMiddleware.validateDates,
                EventsController.createEvent,
            ]);
        this.app.param(`eventId`, eventsMiddleware.extractEventId);
        this.app
            .route(`/events/:eventId`)
            .all(eventsMiddleware.validateEventExists)
            .get(EventsController.getEventById)
            .delete(EventsController.removeEvent);

        this.app.put(`/events/:eventId`, [EventsController.put]);

        this.app.patch(`/events/:eventId`, [EventsController.put]);

        return this.app;
    }
}
