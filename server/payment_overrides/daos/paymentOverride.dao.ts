import { CreatePaymentOverrideDto } from "../dtos/create.paymentOverride.dto";
import { PatchPaymentOverrideDto } from "../dtos/patch.paymentOverride.dto";
import { PutPaymentOverrideDto } from "../dtos/put.paymentOverride.dto";
import debug from "debug";
import { query } from "../../common/services/postgres";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:payment_override-dao`);

class PaymentOverrideDao {
    private tableName = "ts.payment_overrides";

    constructor() {
        log("Created new instace of PaymentOverrideDao");
    }

    async addPaymentOverride(
        paymentOverride: CreatePaymentOverrideDto
    ): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (amount, event_id)
            VALUES ($1, $2)
        `;

        const { rows } = await query(sql, [
            paymentOverride.amount,
            paymentOverride.event_id,
        ]);

        return rows[0];
    }

    async getPaymentOverrides(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getPaymentOverrideById(paymentOverrideId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE payment_override_id = $1
        `;

        const { rows } = await query(sql, [paymentOverrideId]);

        return rows[0];
    }

    async putPaymentOverride(
        paymentOverrideId: string,
        paymentOverride: PutPaymentOverrideDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET amount = $2, event_id = $3
            WHERE payment_override_id = $1
        `;

        const { rows } = await query(sql, [
            paymentOverrideId,
            paymentOverride.amount,
            paymentOverride.event_id,
        ]);

        return rows[0];
    }

    async patchPaymentOverride(
        paymentOverrideId: string,
        paymentOverride: PatchPaymentOverrideDto
    ): Promise<Query> {
        const sql = `
            UPDATE "${this.tableName}"
            SET amount = $2, event_id = $3
            WHERE payment_override_id = $1
        `;

        const { rows } = await query(sql, [
            paymentOverrideId,
            paymentOverride.amount,
            paymentOverride.event_id,
        ]);

        return rows[0];
    }

    async removePaymentOverrideById(paymentOverrideId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE payment_override_id = $1
        `;

        return await query(sql, [paymentOverrideId]);
    }
}

export default new PaymentOverrideDao();
