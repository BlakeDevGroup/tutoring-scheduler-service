import { CommonRoutesConfig } from "../common/common.routes.config";
import PaymentOverrideController from "./controllers/paymentOverride.controller";
import paymentOverrideMiddleware from "./middleware/paymentOverride.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";
import paymentOverrideController from "./controllers/paymentOverride.controller";

export class PaymentOverrideRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "PaymentOverrideRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/payment_overrides`)
            .get(paymentOverrideController.listPaymentOverrides)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                PaymentOverrideController.createPaymentOverride,
            ]);

        this.app.param(
            `paymentOverrideId`,
            paymentOverrideMiddleware.extractPaymentOverrideId
        );

        this.app
            .route(`/payment_overrides/:paymentOverrideId`)
            .all(paymentOverrideMiddleware.validatePaymentOverrideExists)
            .get(paymentOverrideController.getPaymentOverrideById)
            .delete(paymentOverrideController.removePaymentOverride)
            .put(paymentOverrideController.put)
            .patch(paymentOverrideController.patch);

        return this.app;
    }
}
