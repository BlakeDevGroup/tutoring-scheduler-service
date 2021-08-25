import { Client } from "pg";
import { postGresConfigTesting } from "../common.configs";

export const testClient: Client = new Client(postGresConfigTesting);
