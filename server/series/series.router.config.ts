import { CommonRoutesConfig } from "../common/common.routes.config";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";
import seriesController from "./controllers/series.controller";
import seriesMiddleware from "./middleware/series.middleware";
import { CommonRouterConfig } from "../common/common.router.config";

export class SeriesRouter extends CommonRouterConfig {
    constructor() {
        super("SeriesRouter");
    }

    configureRouter(): express.Router {
        this.router
            .route(`/series`)
            .get(seriesController.listSeries)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                seriesController.createSeries,
            ]);

        this.router.param(`seriesId`, seriesMiddleware.extractSeriesId);

        this.router
            .route(`/series/:seriesId`)
            .all(seriesMiddleware.validateSeriesExists)
            .get(seriesController.getSeriesById)
            .delete(seriesController.removeSeries)
            .put(seriesController.put)
            .patch(seriesController.patch);

        return this.router;
    }
}
