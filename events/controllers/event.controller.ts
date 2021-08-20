import express from "express";
import EventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:events-controller");

class EventsController {
    async listEvents(req: express.Request, res: express.Response) {
        const events = await EventService.list(100, 0);
        res.status(200).send(events);
    }

    async getEventById(req: express.Request, res: express.Response) {
        const event = await EventService.readById(req.body.eventId);
        res.status(200).send(event);
    }

    async createEvent(req: express.Request, res: express.Response) {
        const event = await EventService.create(req.body);

        res.status(200).send(event);
    }

    async patch(req: express.Request, res: express.Response) {
        log(await EventService.patchById(req.body.eventId, req.body));

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await EventService.putById(req.body.eventId, req.body));

        res.status(204).send();
    }

    async removeEvent(req: express.Request, res: express.Response) {
        log(await EventService.deleteById(req.body.eventId));

        res.status(204).send();
    }
}

export default new EventsController();
