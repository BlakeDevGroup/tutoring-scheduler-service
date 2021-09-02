import { CommonRoutesConfig } from "../../common/common.routes.config";
import BodyValidationMiddleware from "../../common/middleware/body.validation.middleware";
import express from "express";
import SeriesController from "../controllers/series.controller";
import SeriesMiddleware from "../middleware/series.middleware";
import { CommonRouterConfig } from "../../common/common.router.config";
import { body } from "express-validator";

export default class SeriesRouter extends CommonRouterConfig {
    private seriesController: SeriesController = new SeriesController();
    private seriesMiddleware: SeriesMiddleware = new SeriesMiddleware();
    private VALIDATE_PAYLOAD: any[];
    constructor() {
        super("SeriesRouter");
        this.VALIDATE_PAYLOAD = [
            body("title").isString(),
            body("description").isString(),
            body("start_time").custom(
                this.seriesMiddleware.validateTime.bind(this.seriesMiddleware)
            ),
            body("end_time").custom(
                this.seriesMiddleware.validateTime.bind(this.seriesMiddleware)
            ),
            body("start_recur").custom(
                this.seriesMiddleware.validateDate.bind(this.seriesMiddleware)
            ),
            body("end_recur").custom(
                this.seriesMiddleware.validateDate.bind(this.seriesMiddleware)
            ),
            body("days_of_week").isArray(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            this.seriesMiddleware.datesAreValid.bind(this.seriesMiddleware),
        ];
    }

    configureRouter(): express.Router {
        this.router
            .route(`/series`)
            .get(this.seriesController.listSeries.bind(this.seriesController))
            .post([
                ...this.VALIDATE_PAYLOAD,
                this.seriesController.createSeries.bind(this.seriesController),
            ]);

        this.router.param(
            `series_id`,
            this.seriesMiddleware.extractSeriesId.bind(this.seriesMiddleware)
        );

        this.router
            .route(`/series/:series_id`)
            .all(
                this.seriesMiddleware.validateSeriesExists.bind(
                    this.seriesMiddleware
                )
            )
            .get(
                this.seriesController.getSeriesById.bind(this.seriesController)
            )
            .delete(
                this.seriesController.removeSeries.bind(this.seriesController)
            )
            .put([
                ...this.VALIDATE_PAYLOAD,
                this.seriesController.put.bind(this.seriesController),
            ])
            .patch([
                ...this.VALIDATE_PAYLOAD,
                this.seriesController.patch.bind(this.seriesController),
            ]);

        return this.router;
    }
}
