import { CommonRoutesConfig } from "../common/common.routes.config";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import express from "express";
import seriesController from "./controllers/series.controller";
import seriesMiddleware from "./middleware/series.middleware";

export class SeriesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "SeriesRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/series`)
            .get(seriesController.listSeries)
            .post([
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                seriesController.createSeries,
            ]);

        this.app.param(`seriesId`, seriesMiddleware.extractSeriesId);

        this.app
            .route(`/series/:seriesId`)
            .all(seriesMiddleware.validateSeriesExists)
            .get(seriesController.getSeriesById)
            .delete(seriesController.removeSeries)
            .put(seriesController.put)
            .patch(seriesController.patch);

        return this.app;
    }
}
