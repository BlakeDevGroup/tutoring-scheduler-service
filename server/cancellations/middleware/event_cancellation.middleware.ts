import express from "express";
import debug from "debug";
import EventCancellationServie from "../services/event_cancellation.service";
import { sendFailure } from "../../common/services/message/message.service";
export default class EventCancellationMiddleware {
    private service: EventCancellationServie = new EventCancellationServie();

    async validateEventCancellationExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const result = await this.service.listByEventId(req.body.event_id);

        if (result.success) {
            req.body.cancellation_id = result.data[0].cancellation_id;
            next();
        } else {
            res.status(result.statusCode);
            res.send(result);
        }
    }

    async validateCancellationDoesNotExistOnEvent(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const result = await this.service.listByEventId(req.body.event_id);

        if (result.success) {
            const ERROR_MESSAGE = `Event: ${req.body.event_id} is already cancelled`;
            res.status(400).send(
                sendFailure(ERROR_MESSAGE, new Error(ERROR_MESSAGE), 400)
            );
        } else {
            next();
        }
    }
}
