import express from "express";
import CancellationService from "../services/cancellation.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:cancellation-controller");

class CancellationController {
    private cancellationService: CancellationService =
        new CancellationService();
    async listCancellations(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.list(100, 0);

        res.status(result.statusCode).send(result);
    }

    async getCancellationById(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.readById(
            req.body.cancellation_id
        );

        res.status(result.statusCode).send(result);
    }

    async createCancellation(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.create(req.body);

        res.status(result.statusCode).send(result);
    }

    async patch(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.patchById(
            req.body.cancellation_id,
            req.body
        );

        res.status(result.statusCode).send(result);
    }

    async put(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.putById(
            req.body.cancellation_id,
            req.body
        );

        res.status(result.statusCode).send(result);
    }

    async removeCancellation(req: express.Request, res: express.Response) {
        const result = await this.cancellationService.deleteById(
            req.body.cancellation_id
        );

        res.status(result.statusCode).send(result);
    }
}

export default CancellationController;
