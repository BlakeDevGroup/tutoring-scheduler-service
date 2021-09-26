import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";
import CancellationController from "../controllers/cancellation.controller";
import CancellationMiddleware from "../middleware/cancellation.middleware";
import { CommonRouterConfig } from "../../common/common.router.config";

export default class CancellationRouter extends CommonRouterConfig {
    private cancellationController: CancellationController =
        new CancellationController();
    private cancellationMiddleware: CancellationMiddleware =
        new CancellationMiddleware();
    constructor() {
        super("CancellatonRoutes");
    }

    configureRouter(): express.Router {
        this.router
            .route(`/cancellations`)
            .get(
                this.cancellationController.listCancellations.bind(
                    this.cancellationController
                )
            )
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                this.cancellationController.createCancellation.bind(
                    this.cancellationController
                ),
            ]);

        this.router.param(
            `cancellationId`,
            this.cancellationMiddleware.extractCancellationId.bind(
                this.cancellationMiddleware
            )
        );

        this.router
            .route(`/cancellations/:cancellationId`)
            .all(
                this.cancellationMiddleware.validateCancellationExists.bind(
                    this.cancellationMiddleware
                )
            )
            .get(
                this.cancellationController.getCancellationById.bind(
                    this.cancellationController
                )
            )
            .delete(
                this.cancellationController.removeCancellation.bind(
                    this.cancellationController
                )
            )
            .put(
                this.cancellationController.put.bind(
                    this.cancellationController
                )
            )
            .patch(
                this.cancellationController.patch.bind(
                    this.cancellationController
                )
            );
        return this.router;
    }
}
