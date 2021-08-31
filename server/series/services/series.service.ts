import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateSeriesDto } from "../dtos/create.series.dto";
import { PatchSeriesDto } from "../dtos/patch.series.dto";
import { PutSeriesDto } from "../dtos/put.series.dto";
import SeriesDao from "../daos/series.dao";

class SeriesService implements CRUD {
    private seriesDao: SeriesDao = new SeriesDao();
    async create(resource: CreateSeriesDto) {
        return this.seriesDao.addSeries(resource);
    }

    async deleteById(id: string) {
        return this.seriesDao.removeSeriesById(id);
    }

    async list(limit: number, page: number) {
        return this.seriesDao.getSeries();
    }

    async patchById(id: string, resource: PatchSeriesDto) {
        return this.seriesDao.patchSeriesById(id, resource);
    }

    async putById(id: string, resource: PutSeriesDto) {
        return this.seriesDao.putSeriesById(id, resource);
    }

    async readById(id: string) {
        return this.seriesDao.getSeriesById(id);
    }

    async readByIdAndCalendarId(seriesId: string, calendarId: string) {
        return this.seriesDao.getSeriesByIdAndCalendarId(seriesId, calendarId);
    }
}

export default SeriesService;
