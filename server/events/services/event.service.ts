import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateEventDto } from "../dtos/create.event.dto";
import { PatchEventDto } from "../dtos/patch.event.dto";
import { PutEventDto } from "../dtos/put.event.dto";
import EventDao from "../daos/event.dao";

class EventService implements CRUD {
    private eventDao: EventDao = new EventDao();

    async create(resource: CreateEventDto) {
        return this.eventDao.addEvent(resource);
    }

    async deleteById(id: string) {
        return this.eventDao.removeEventById(id);
    }

    async list(limit: number, page: number) {
        return this.eventDao.getEvents();
    }

    async patchById(id: string, resource: PatchEventDto) {
        return this.eventDao.patchEventById(id, resource);
    }

    async putById(id: string, resource: PutEventDto) {
        return this.eventDao.putEventById(id, resource);
    }

    async readById(id: string) {
        return this.eventDao.getEventById(id);
    }

    async listByCalendarId(calendarId: string, limit: number, page: number) {
        return this.eventDao.getEventsByCalendarId(calendarId);
    }

    async readByIdAndCalendarId(eventId: string, calendarId: string) {
        return this.eventDao.getEventByCalendarId(eventId, calendarId);
    }
}

export default EventService;
