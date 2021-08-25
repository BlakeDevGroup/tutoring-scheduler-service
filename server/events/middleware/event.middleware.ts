import express from "express";
import EventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:event-middleware");

class EventMiddleware {
    private eventService: EventService = new EventService();
    async validateDates(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            this.startDateIsLessThanEndDate(
                req.body.date_start,
                req.body.date_end
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

    async datesAreValid(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const startDate = new Date(req.body.start_date);
        const endDate = new Date(req.body.end_date);

        return !(isNaN(startDate.getTime()) && isNaN(endDate.getTime()));
    }
}

export default new EventMiddleware();
