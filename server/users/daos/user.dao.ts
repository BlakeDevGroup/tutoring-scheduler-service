import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import shortid from "shortid";
import debug from "debug";
import { query } from "../../common/services/postgres.service";
import { Query } from "pg";

const log: debug.IDebugger = debug(`app:user-dao`);

class UserDao {
    private tableName = "ts.users";
    constructor() {
        log("Created new instance of UsersDao");
    }

    async addUser(user: CreateUserDto): Promise<Query> {
        const sql = `
            INSERT INTO "${this.tableName}" (email, password, first_name, last_name)
            VALUES ($1, $2, $3, $4)
        `;

        const { rows } = await query(sql, [
            user.email,
            user.password,
            user.firstName,
            user.lastName,
        ]);

        return rows[0];
    }

    async getUsers(): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
        `;

        const { rows } = await query(sql, []);

        return rows;
    }

    async getUserById(userId: string): Promise<Query> {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE user_id = $1
        `;
        const { rows } = await query(sql, [userId]);

        return rows[0];
    }

    async putUserById(userId: string, user: PutUserDto) {
        const sql = `
            UPDATE "${this.tableName}"
            SET email = $2, password = $3, first_name = $4, last_name = $5
            WHERE user_id = $1
        `;

        const { rows } = await query(sql, [
            userId,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
        ]);

        return rows[0];
    }

    async patchUserById(userId: string, user: PatchUserDto) {
        const sql = `
            UPDATE "${this.tableName}"
            SET email = $2, password = $3, first_name = $4, last_name = $5
            WHERE user_id = $1
        `;

        const { rows } = await query(sql, [
            userId,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
        ]);

        return rows[0];
    }

    async removeUserById(userId: string) {
        const sql = `
            DELETE FROM "${this.tableName}" WHERE userId = $1
        `;

        return await query(sql, [userId]);
    }

    async getUserByEmail(email: string) {
        const sql = `
            SELECT * FROM "${this.tableName}"
            WHERE email = $1
        `;
        const { rows } = await query(sql, [email]);

        return rows === undefined ? rows : rows[0];
    }
}

export default new UserDao();
