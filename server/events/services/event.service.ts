import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateEventDto } from "../dtos/create.event.dto";
import { PatchEventDto } from "../dtos/patch.event.dto";
import { PutEventDto } from "../dtos/put.event.dto";
import EventDao from "../daos/event.dao";

class EventService implements CRUD {
    async create(resource: CreateEventDto) {
        return EventDao.addEvent(resource);
    }

    async deleteById(id: string) {
        return EventDao.removeEventById(id);
    }

    async list(limit: number, page: number) {
        return EventDao.getEvents();
    }

    async patchById(id: string, resource: PatchEventDto) {
        return EventDao.patchEventById(id, resource);
    }

    async putById(id: string, resource: PutEventDto) {
        return EventDao.putEventById(id, resource);
    }

    async readById(id: string) {
        return EventDao.getEventById(id);
    }
}

export default new EventService();
