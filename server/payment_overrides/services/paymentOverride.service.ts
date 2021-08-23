import { CRUD } from "../../common/interfaces/crud.interface";
import { CreatePaymentOverrideDto } from "../dtos/create.paymentOverride.dto";
import { PutPaymentOverrideDto } from "../dtos/put.paymentOverride.dto";
import { PatchPaymentOverrideDto } from "../dtos/patch.paymentOverride.dto";
import PaymentOverrideDao from "../daos/paymentOverride.dao";

class PaymentOverrideService implements CRUD {
    async create(resource: CreatePaymentOverrideDto) {
        return PaymentOverrideDao.addPaymentOverride(resource);
    }

    async deleteById(id: string) {
        return PaymentOverrideDao.removePaymentOverrideById(id);
    }

    async list(limit: number, page: number) {
        return PaymentOverrideDao.getPaymentOverrides();
    }

    async patchById(id: string, resource: PatchPaymentOverrideDto) {
        return PaymentOverrideDao.patchPaymentOverride(id, resource);
    }

    async putById(id: string, resource: PutPaymentOverrideDto) {
        return PaymentOverrideDao.putPaymentOverride(id, resource);
    }

    async readById(id: string) {
        return PaymentOverrideDao.getPaymentOverrideById(id);
    }
}

export default new PaymentOverrideService();
