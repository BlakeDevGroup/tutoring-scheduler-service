import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateEventDto } from "../../events/dtos/create.event.dto";
import { PatchCalendarDto } from "../dtos/patch.calendar.dto";
import { PutCalendarDto } from "../dtos/put.calendar.dto";
import CalendarDao from "../daos/calendar.dao";
import { CreateCalendarDto } from "../dtos/create.calendar.dto";

class CalendarService implements CRUD {
    async create(resource: CreateCalendarDto) {
        return CalendarDao.addCalendar(resource);
    }

    async deleteById(id: string) {
        return CalendarDao.removeCalendarById(id);
    }

    async list(limit: number, page: number) {
        return CalendarDao.getCalendars();
    }

    async patchById(id: string, resource: PatchCalendarDto) {
        return CalendarDao.patchCalendarById(id, resource);
    }

    async putById(id: string, resource: PutCalendarDto) {
        return CalendarDao.putCalendarById(id, resource);
    }

    async readById(id: string) {
        return CalendarDao.getCalendarById(id);
    }
}

export default new CalendarService();
