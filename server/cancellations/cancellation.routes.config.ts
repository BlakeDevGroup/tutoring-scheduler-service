import { CommonRoutesConfig } from "../common/common.routes.config";
import cancellationController from "./controllers/cancellation.controller";
import cancellationMiddleware from "./middleware/cancellation.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";

export class CancellationRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "CancellatonRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/cancellations`)
            .get(cancellationController.listCancellations)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                cancellationController.createCancellation,
            ]);

        this.app.param(
            `cancellationId`,
            cancellationMiddleware.extractCancellationId
        );

        this.app
            .route(`cancellations/:cancellationId`)
            .all(cancellationMiddleware.validateCancellationExists)
            .get(cancellationController.getCancellationById)
            .delete(cancellationController.removeEvent)
            .put(cancellationController.put)
            .patch(cancellationController.patch);
        return this.app;
    }
}
