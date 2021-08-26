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
        const datesAreValid: Boolean = this.startDateIsLessThanEndDate(
            req.body.date_start,
            req.body.date_end
        );
        if (datesAreValid) {
            next();
        } else {
            res.status(400).send({
                error: `End date (${req.body.end_date}) occurs before start date (${req.body.start_date})`,
            });
        }
    }
    private startDateIsLessThanEndDate(startDate: string, endDate: string) {
        const formattedStartDate: Date = new Date(startDate);
        const formattedEndDate: Date = new Date(endDate);
        return formattedStartDate < formattedEndDate;
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
        const datesAreValid =
            this.isDateValid(startDate) && this.isDateValid(endDate);

        if (datesAreValid) {
            next();
        } else {
            res.status(400).send({
                error: this.invalidDatesMessage(startDate, endDate),
            });
        }
    }

    private invalidDatesMessage(startDate: Date, endDate: Date): String {
        let message: string = "The following dates are invalid:";

        if (this.isDateValid(startDate) === false) {
            message += ` start_date`;
        }

        if (this.isDateValid(endDate) === false) {
            if (message.includes("start_date")) {
                message += ",";
            }
            message += ` end_date`;
        }

        return message;
    }
    private isDateValid(date: Date): Boolean {
        return !isNaN(date.getTime());
    }
}

export default new EventMiddleware();
