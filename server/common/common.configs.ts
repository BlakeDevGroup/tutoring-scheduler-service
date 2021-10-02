import { Pool, PoolConfig } from "pg";

export const postgresConfig: PoolConfig = {
    host: process.env.DB_HOST_DEVELOPMENT,
    user: process.env.DB_USER_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_DATABASE_DEVELOPMENT,
};

export const memCacheConfig = {
    host: "mc3.dev.ec2.memcachier.com:11211",
    username: "899926",
    password: "0E222B57DEA253FB7AFE4FAB3FBF91E2",
};

export const postGresConfigTesting: PoolConfig = {
    host: process.env.DB_HOST_TEST,
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_DATABSE_TEST,
};
