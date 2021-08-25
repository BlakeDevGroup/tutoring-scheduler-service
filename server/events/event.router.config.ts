import { CommonRoutesConfig } from "../common/common.routes.config";
import EventsController from "./controllers/event.controller";
import eventsMiddleware from "./middleware/event.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";
import { CommonRouterConfig } from "../common/common.router.config";
import { body } from "express-validator";

export class EventRouter extends CommonRouterConfig {
    constructor() {
        super("EventRouter");
    }

    configureRouter(): express.Router {
        this.router
            .route(`/events`)
            .get(EventsController.listEvents)
            .post([
                body("title").isString(),
                body("all_day").isBoolean(),
                body("user_id").isNumeric(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                // eventsMiddleware.datesAreValid,
                EventsController.createEvent,
            ]);
        this.router.param(`eventId`, eventsMiddleware.extractEventId);
        this.router
            .route(`/events/:eventId`)
            .all(eventsMiddleware.validateEventExists)
            .get(EventsController.getEventById)
            .delete(EventsController.removeEvent)
            .put(EventsController.put)
            .patch(EventsController.patch);

        return this.router;
    }
}
