import express from "express";
import debug from "debug";
import CancellationService from "../services/cancellation.service";

const log: debug.IDebugger = debug("app:cancellation-middleware");

class CancellationMiddleware {
    private cancellationService: CancellationService =
        new CancellationService();
    async validateCancellationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const result = await this.cancellationService.readById(
            req.params.cancellation_id
        );

        if (result.success) {
            next();
        } else {
            res.status(result.statusCode).send(result);
        }
    }

    async extractCancellationId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.cancellation_id = req.params.cancellation_id;
        next();
    }
}

export default CancellationMiddleware;
