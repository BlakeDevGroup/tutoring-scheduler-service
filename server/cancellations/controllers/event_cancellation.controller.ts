import express from "express";
import EventCancellationService from "../services/event_cancellation.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:event_cancellation-controller");

export default class EventCancellationController {
    private eventCancellationService: EventCancellationService =
        new EventCancellationService();

    async listCancellations(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.list(100, 1);

        res.status(result.statusCode).send(result);
    }

    async getCancellationById(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.getById(
            req.body.cancellation_id
        );

        res.status(result.statusCode).send(result);
    }

    async listCancellationsByEventId(
        req: express.Request,
        res: express.Response
    ) {
        const result = await this.eventCancellationService.listByEventId(
            req.body.event_id
        );

        res.status(result.statusCode).send(result);
    }

    async createCancellation(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.create(req.body);

        res.status(result.statusCode).send(result);
    }

    async put(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.putById(
            req.body.cancellation_id,
            req.body
        );

        res.status(result.statusCode).send(result);
    }

    async patch(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.patchById(
            req.body.cancellation_id,
            req.body
        );

        res.status(result.statusCode).send(result);
    }

    async removeCancellation(req: express.Request, res: express.Response) {
        const result = await this.eventCancellationService.deleteById(
            req.body.cancellation_id
        );

        res.status(result.statusCode).send(result);
    }
}
