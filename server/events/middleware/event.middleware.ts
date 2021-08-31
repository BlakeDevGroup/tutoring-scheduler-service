import express from "express";
import EventService from "../services/event.service";
import debug from "debug";
import { sendFailure } from "../../common/services/message/message.service";

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
            res.status(400).send(
                sendFailure(
                    `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`,
                    new Error(
                        `date_end (${req.body.date_end}) occurs before date_start (${req.body.date_start})`
                    )
                )
            );
        }
    }

    async validateEventExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const event = await this.eventService.readByIdAndCalendarId(
            req.params.event_id,
            req.body.calendar_id
        );

        if (event.success) {
            next();
        } else {
            res.status(event.statusCode).send(event);
        }
    }

    async extractEventId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.event_id = req.params.event_id;
        next();
    }

    isDateValid(date: string): Boolean {
        return !isNaN(new Date(date).getTime());
    }
}

export default EventMiddleware;
