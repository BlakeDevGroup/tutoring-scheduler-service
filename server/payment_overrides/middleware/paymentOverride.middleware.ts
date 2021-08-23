import express from "express";
import PaymentOverrideService from "../services/paymentOverride.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:payment_override-middleware");

class PaymentOverrideMiddleware {
    async validatePaymentOverrideExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const paymentOverride = await PaymentOverrideService.readById(
            req.params.paymentOverrideId
        );

        if (paymentOverride) {
            next();
        } else {
            res.status(404).send({
                error: `PaymentOverride ${req.params.paymentOverrideId} not found`,
            });
        }
    }

    async extractPaymentOverrideId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.paymentOverrideId = req.params.paymentOverrideId;
        next();
    }
}

export default new PaymentOverrideMiddleware();
