import express from "express";
import EventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:event-middleware");

class EventMiddleware {
    async validateDates(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            this.startDateIsLessThanEndDate(
                req.body.start_date,
                req.body.end_date
            )
        ) {
            next();
        } else {
            res.status(400).send({
                error: `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`,
            });
        }
    }

    private startDateIsLessThanEndDate(startDate: string, endDate: string) {
        return new Date(startDate) < new Date(endDate);
    }

    async validateEventExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const event = await EventService.readById(req.params.eventId);

        if (event) {
            next();
        } else {
            res.status(404).send({
                error: `Event ${req.params.eventId} not found`,
            });
        }
    }

    async extractEventId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.eventId = req.params.eventId;
        next();
    }
}

export default new EventMiddleware();
