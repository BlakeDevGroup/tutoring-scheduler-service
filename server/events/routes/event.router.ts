import EventsController from "../controllers/event.controller";
import EventsMiddleware from "../middleware/event.middleware";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";
import { CommonRouterConfig } from "../../common/common.router.config";
import { body } from "express-validator";
import EventCancellationRouter from "../../cancellations/routes/event_cancellaton.router";

export default class EventRouter extends CommonRouterConfig {
    private eventsController = new EventsController();
    private eventsMiddleware = new EventsMiddleware();
    private VALIDATE_PAYLOAD: any[];
    constructor() {
        super("EventRouter");
        this.VALIDATE_PAYLOAD = [
            body("title").isString(),
            body("all_day").isBoolean(),
            body("user_id").isNumeric(),
            body("date_start").custom(
                this.eventsMiddleware.isDateValid.bind(this.eventsMiddleware)
            ),
            body("date_end").custom(
                this.eventsMiddleware.isDateValid.bind(this.eventsMiddleware)
            ),

            BodyValidationMiddleware.verifyBodyFieldsErrors,

            this.eventsMiddleware.startDateIsLessThanEndDate.bind(
                this.eventsMiddleware
            ),
        ];
    }
    configureRouter = (): express.Router => {
        this.router
            .route(`/events`)
            .get(this.eventsController.listEvents.bind(this.eventsController))
            .post([
                ...this.VALIDATE_PAYLOAD,
                this.eventsController.createEvent.bind(this.eventsController),
            ]);
        this.router.param(
            `event_id`,
            this.eventsMiddleware.extractEventId.bind(this.eventsMiddleware)
        );
        this.router
            .route(`/events/:event_id`)
            .all(
                this.eventsMiddleware.validateEventExists.bind(
                    this.eventsMiddleware
                )
            )
            .get(this.eventsController.getEventById.bind(this.eventsController))
            .delete(
                this.eventsController.removeEvent.bind(this.eventsController)
            )
            .put([
                ...this.VALIDATE_PAYLOAD,
                this.eventsController.put.bind(this.eventsController),
            ])
            .patch(
                ...this.VALIDATE_PAYLOAD,
                this.eventsController.patch.bind(this.eventsController)
            );

        this.router.use(
            "/events/:event_id",
            new EventCancellationRouter().configureRouter()
        );

        return this.router;
    };
}
