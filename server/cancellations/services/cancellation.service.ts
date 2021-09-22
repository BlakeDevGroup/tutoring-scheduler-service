import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateCancellationDto } from "../dtos/create.cancellation.dto";
import { PatchCancellationDto } from "../dtos/patch.cancellation.dto";
import { PutCancellationDto } from "../dtos/put.cancellation.dto";
import CancellationDao from "../daos/cancellation.dao";

class CancellationService implements CRUD {
    private cancellationDao: CancellationDao = new CancellationDao();
    async create(resource: CreateCancellationDto) {
        return this.cancellationDao.addCancellation(resource);
    }

    async deleteById(id: string) {
        return this.cancellationDao.removeCancellationById(id);
    }

    async list(limit: number, page: number) {
        return this.cancellationDao.getCancellations();
    }

    async patchById(id: string, resource: PatchCancellationDto) {
        return this.cancellationDao.patchCancellationById(id, resource);
    }

    async putById(id: string, resource: PutCancellationDto) {
        return this.cancellationDao.putCancellationById(id, resource);
    }

    async readById(id: string) {
        return this.cancellationDao.getCancellationById(id);
    }
}

export default new CancellationService();
