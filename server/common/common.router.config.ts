import express from "express";
import { Router } from "express";

export abstract class CommonRouterConfig {
    name: string;
    router: express.Router;

    constructor(name: string) {
        this.name = name;
        this.router = express.Router();
        this.configureRouter();
    }

    getName() {
        return this.name;
    }

    abstract configureRouter(): express.Router;
}
