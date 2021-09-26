import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateEventCancellationDto } from "../dtos/create.event_cancellation.dto";
import { PutEventCancellationDto } from "../dtos/put.event_cancellation.dto";
import { PatchCancellationDto } from "../dtos/patch.cancellation.dto";
import EventCancellationDao from "../daos/event_cancellation.dao";
import { PatchEventCancellationDto } from "../dtos/patch.event_cancellation.dto";

export default class EventCancellationService {
    private eventCancellationDao = new EventCancellationDao();

    async list(limit: number, page: number) {
        return await this.eventCancellationDao.getCancellations();
    }

    async getById(cancellation_id: string) {
        return await this.eventCancellationDao.getCancellationById(
            cancellation_id
        );
    }

    async listByEventId(event_id: string) {
        return await this.eventCancellationDao.getCancellationsByEventId(
            event_id
        );
    }

    async putById(cancellation_id: string, resource: PutEventCancellationDto) {
        return await this.eventCancellationDao.putEventCancellation(
            cancellation_id,
            resource
        );
    }

    async patchById(
        cancellation_id: string,
        resource: PatchEventCancellationDto
    ) {
        return await this.eventCancellationDao.patchEventCancellation(
            cancellation_id,
            resource
        );
    }

    async deleteById(cancellation_id: string) {
        return await this.eventCancellationDao.deleteEventCancellation(
            cancellation_id
        );
    }

    async create(resource: CreateEventCancellationDto) {
        return await this.eventCancellationDao.createEventCancellation(
            resource
        );
    }
}
