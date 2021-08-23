import express from "express";
import cancellationService from "../services/cancellation.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:cancellation-controller");

class CancellationController {
    async listCancellations(req: express.Request, res: express.Response) {
        const cancellations = await cancellationService.list(100, 0);

        res.status(200).send(cancellations);
    }

    async getCancellationById(req: express.Request, res: express.Response) {
        const cancellation = await cancellationService.readById(
            req.body.cancellationId
        );

        res.status(200).send(cancellation);
    }

    async createCancellation(req: express.Request, res: express.Response) {
        const cancellation = await cancellationService.create(req.body);

        res.status(200).send(cancellation);
    }

    async patch(req: express.Request, res: express.Response) {
        log(
            await cancellationService.patchById(
                req.body.cancellationId,
                req.body
            )
        );

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(
            await cancellationService.putById(req.body.cancellationId, req.body)
        );
        res.status(204).send();
    }

    async removeEvent(req: express.Request, res: express.Response) {
        log(await cancellationService.deleteById(req.body.cancellationId));

        res.status(204).send();
    }
}

export default new CancellationController();
