import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";
import EventCancellationController from "../controllers/event_cancellation.controller";
import EventCancellationMiddleware from "../middleware/event_cancellation.middleware";
// import Eve from "../middleware/series.middleware";
import { CommonRouterConfig } from "../../common/common.router.config";
import { body } from "express-validator";

export default class EventCancellationRouter extends CommonRouterConfig {
    private controller: EventCancellationController =
        new EventCancellationController();
    private middleware: EventCancellationMiddleware =
        new EventCancellationMiddleware();
    private VALIDATE_PAYLOAD: any[];

    constructor() {
        super("EventCancellationRouter");
        this.VALIDATE_PAYLOAD = [
            body("event_id").isNumeric(),
            body("reason").isString(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
        ];
    }

    configureRouter(): express.Router {
        this.router
            .route("/cancellations")
            .get(
                this.controller.listCancellationsByEventId.bind(this.controller)
            )
            .post([
                ...this.VALIDATE_PAYLOAD,
                this.middleware.validateCancellationDoesNotExistOnEvent.bind(
                    this.middleware
                ),
                this.controller.createCancellation.bind(this.controller),
            ])

            .put([
                ...this.VALIDATE_PAYLOAD,
                this.middleware.validateEventCancellationExists.bind(
                    this.middleware
                ),
                this.controller.put.bind(this.controller),
            ])
            .patch([
                ...this.VALIDATE_PAYLOAD,
                this.middleware.validateEventCancellationExists.bind(
                    this.middleware
                ),
                this.controller.patch.bind(this.controller),
            ])

            .delete([
                this.middleware.validateEventCancellationExists.bind(
                    this.middleware
                ),
                this.controller.removeCancellation.bind(this.controller),
            ]);
        return this.router;
    }
}
