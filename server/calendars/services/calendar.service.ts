import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateEventDto } from "../../events/dtos/create.event.dto";
import { PatchCalendarDto } from "../dtos/patch.calendar.dto";
import { PutCalendarDto } from "../dtos/put.calendar.dto";
import CalendarDao from "../daos/calendar.dao";
import { CreateCalendarDto } from "../dtos/create.calendar.dto";

class CalendarService implements CRUD {
    private calendarDao: CalendarDao = new CalendarDao();
    async create(resource: CreateCalendarDto) {
        return this.calendarDao.addCalendar(resource);
    }

    async deleteById(id: string) {
        return this.calendarDao.removeCalendarById(id);
    }

    async list(limit: number, page: number) {
        return this.calendarDao.getCalendars();
    }

    async patchById(id: string, resource: PatchCalendarDto) {
        return this.calendarDao.patchCalendarById(id, resource);
    }

    async putById(id: string, resource: PutCalendarDto) {
        return this.calendarDao.putCalendarById(id, resource);
    }

    async readById(id: string) {
        return this.calendarDao.getCalendarById(id);
    }
}

export default CalendarService;
