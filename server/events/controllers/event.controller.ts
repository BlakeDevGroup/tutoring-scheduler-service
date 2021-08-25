import express from "express";
import EventService from "../services/event.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:event-controller");

class EventsController {
    private eventService: EventService = new EventService();
    async listEvents(req: express.Request, res: express.Response) {
        const events = await this.eventService.listByCalendarId(
            req.body.calendarId,
            req.body.limit || 100,
            req.body.page || 1
        );

        res.status(200).send(events);
    }

    async getEventById(req: express.Request, res: express.Response) {
        const event = await this.eventService.readById(req.body.eventId);
        res.status(200).send(event);
    }

    async createEvent(req: express.Request, res: express.Response) {
        await this.eventService.create(req.body);

        res.status(200).send({
            success: "Event Successfully Created",
        });
    }

    async patch(req: express.Request, res: express.Response) {
        log(await this.eventService.patchById(req.body.eventId, req.body));

        res.status(204).send({
            success: `Event id:${req.body.eventId} successfully Patched`,
        });
    }

    async put(req: express.Request, res: express.Response) {
        log(await this.eventService.putById(req.body.eventId, req.body));

        res.status(204).send({
            success: `Event id:${req.body.eventId} successfully Updated`,
        });
    }

    async removeEvent(req: express.Request, res: express.Response) {
        log(await this.eventService.deleteById(req.body.eventId));

        res.status(204).send({
            success: `Event id:${req.body.eventId} successfully Deleted`,
        });
    }
}

export default new EventsController();
