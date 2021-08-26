import express from "express";
import EventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:event-middleware");

class EventMiddleware {
    private eventService: EventService = new EventService();
    async startDateIsLessThanEndDate(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const formattedStartDate: Date = new Date(req.body.date_start);
        const formattedEndDate: Date = new Date(req.body.date_end);

        if (formattedStartDate < formattedEndDate) {
            next();
        } else {
            res.status(400).send({
                error: `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`,
            });
        }
    }

    async validateEventExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const event = await this.eventService.readById(req.params.eventId);

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

    isDateValid(date: string): Boolean {
        return !isNaN(new Date(date).getTime());
    }
}

export default EventMiddleware;
