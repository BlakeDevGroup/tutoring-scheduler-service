import { Pool, PoolConfig } from "pg";

export const postgresConfig: PoolConfig = {
    host: "chunee.db.elephantsql.com",
    user: "kwuhqibe",
    password: "l6YIXpBrgcz9G5TaStPvG9NBe0HPcb01",
    database: "kwuhqibe",
};

export const memCacheConfig = {
    host: "mc3.dev.ec2.memcachier.com:11211",
    username: "899926",
    password: "0E222B57DEA253FB7AFE4FAB3FBF91E2",
};

export const postGresConfigTesting: PoolConfig = {
    host: "chunee.db.elephantsql.com",
    user: "denqnwfv",
    password: "ccGkavduTJaeJBmpgJ6f4CaNV94FSdS6",
    database: "denqnwfv",
};
