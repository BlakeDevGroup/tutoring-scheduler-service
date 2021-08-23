import express from "express";
import PaymentOverrideService from "../services/paymentOverride.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:payment_override-controller");

class PaymentOverrideController {
    async listPaymentOverrides(req: express.Request, res: express.Response) {
        const paymentOverride = await PaymentOverrideService.list(100, 0);

        res.status(200).send(paymentOverride);
    }

    async getPaymentOverrideById(req: express.Request, res: express.Response) {
        const paymentOverride = await PaymentOverrideService.readById(
            req.body.paymentOverrideId
        );

        res.status(200).send(paymentOverride);
    }

    async createPaymentOverride(req: express.Request, res: express.Response) {
        const paymentOverride = await PaymentOverrideService.create(req.body);

        res.status(200).send(paymentOverride);
    }

    async patch(req: express.Request, res: express.Response) {
        log(
            await PaymentOverrideService.patchById(
                req.body.paymentOverrideId,
                req.body
            )
        );

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(
            await PaymentOverrideService.putById(
                req.body.paymentOverrideId,
                req.body
            )
        );

        res.status(204).send();
    }

    async removePaymentOverride(req: express.Request, res: express.Response) {
        log(
            await PaymentOverrideService.deleteById(req.body.paymentOverrideId)
        );

        res.status(204).send();
    }
}

export default new PaymentOverrideController();
