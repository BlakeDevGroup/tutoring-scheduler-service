import express from "express";
import EventService from "../services/event.service";
import debug from "debug";
import { Result } from "express-validator";

const log: debug.IDebugger = debug("app:event-controller");

class EventsController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }
    async listEvents(req: express.Request, res: express.Response) {
        console.log(this);
        const events = await this.eventService.listByCalendarId(
            req.body.calendar_id,
            req.body.limit || 100,
            req.body.page || 1
        );
        if (events.success) res.status(200).send(events);
        else res.status(events.statusCode).send(events);
    }

    async getEventById(req: express.Request, res: express.Response) {
        const result = await this.eventService.readById(req.body.event_id);

        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    }

    async getEventByIdAndCalendarId(
        req: express.Request,
        res: express.Response
    ) {
        const event = await this.eventService.readByIdAndCalendarId(
            req.body.event_id,
            req.body.calendar_id
        );

        res.status(event.statusCode).send(event);
    }

    async createEvent(req: express.Request, res: express.Response) {
        const result = await this.eventService.create(req.body);

        if (result.success) {
            res.status(201).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async patch(req: express.Request, res: express.Response) {
        const result = await this.eventService.patchById(
            req.body.event_id,
            req.body
        );

        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async put(req: express.Request, res: express.Response) {
        const result = await this.eventService.putById(
            req.body.event_id,
            req.body
        );

        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }

    async removeEvent(req: express.Request, res: express.Response) {
        const result = await this.eventService.deleteById(req.body.event_id);

        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(400).send(result);
        }
    }
}

export default EventsController;
