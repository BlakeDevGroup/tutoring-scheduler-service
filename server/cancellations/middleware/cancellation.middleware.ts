import express from "express";
import cancellationService from "../services/cancellation.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:cancellation-middleware");

class CancellationMiddleware {
    async validateCancellationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const cancellation = await cancellationService.readById(
            req.params.cancellationId
        );

        if (cancellation) {
            next();
        } else {
            res.status(404).send({
                error: `Cancellation ${req.params.cancellationId} not found`,
            });
        }
    }

    async extractCancellationId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.cancellationId = req.params.cancellationId;
        next();
    }
}

export default new CancellationMiddleware();
