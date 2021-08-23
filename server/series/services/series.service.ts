import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateSeriesDto } from "../dtos/create.series.dto";
import { PatchSeriesDto } from "../dtos/patch.series.dto";
import { PutSeriesDto } from "../dtos/put.series.dto";
import seriesDao from "../daos/series.dao";

class SeriesService implements CRUD {
    async create(resource: CreateSeriesDto) {
        return seriesDao.addSeries(resource);
    }

    async deleteById(id: string) {
        return seriesDao.removeSeriesById(id);
    }

    async list(limit: number, page: number) {
        return seriesDao.getSeries();
    }

    async patchById(id: string, resource: PatchSeriesDto) {
        return seriesDao.patchSeriesById(id, resource);
    }

    async putById(id: string, resource: PutSeriesDto) {
        return seriesDao.putSeriesById(id, resource);
    }

    async readById(id: string) {
        return seriesDao.getSeriesById(id);
    }
}

export default new SeriesService();
