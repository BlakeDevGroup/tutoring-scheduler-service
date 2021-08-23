import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateCancellationDto } from "../dtos/create.cancellation.dto";
import { PatchCancellationDto } from "../dtos/patch.cancellation.dto";
import { PutCancellationDto } from "../dtos/put.cancellation.dto";
import cancellationDao from "../daos/cancellation.dao";

class CancellationService implements CRUD {
    async create(resource: CreateCancellationDto) {
        return cancellationDao.addCancellation(resource);
    }

    async deleteById(id: string) {
        return cancellationDao.removeCancellationById(id);
    }

    async list(limit: number, page: number) {
        return cancellationDao.getCancellations();
    }

    async patchById(id: string, resource: PatchCancellationDto) {
        return cancellationDao.patchCancellationById(id, resource);
    }

    async putById(id: string, resource: PutCancellationDto) {
        return cancellationDao.putCancellationById(id, resource);
    }

    async readById(id: string) {
        return cancellationDao.getCancellationById(id);
    }
}

export default new CancellationService();
