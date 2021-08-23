import express from "express";
import seriesService from "../services/series.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:series-middleware");

class SeriesMiddleware {
    async validateSeriesExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const series = await seriesService.readById(req.params.seriesId);

        if (series) {
            next();
        } else {
            res.status(404).send({
                error: `Series ${req.params.seriesId} not found`,
            });
        }
    }

    async extractSeriesId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.seriesId = req.params.seriesId;
        next();
    }
}

export default new SeriesMiddleware();
