import sinon, { SinonSandbox, SinonStub, spy } from "sinon";
import chai, { expect, should } from "chai";
import sinonChai from "sinon-chai";
import proxyquire from "proxyquire";
import { createRequest, createResponse } from "node-mocks-http";
import EventRouter from "./event.router";
import express from "express";
import request from "supertest";
import supertest from "supertest";
import EventController from "../controllers/event.controller";
// import app from "../../../app";
const RESOLVE_STMT = "RESOLVED";
describe("EventRouter", () => {
    let app = express();
    app.use(express.json());
    app.use("/", new EventRouter().configureRouter());
    beforeEach(() => {});
    afterEach(() => {
        sinon.restore();
    });

    describe("GET /events", () => {});
});
