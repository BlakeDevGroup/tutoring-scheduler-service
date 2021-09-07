import express from "express";
import seriesService from "../services/series.service";
import debug from "debug";
import SeriesService from "../services/series.service";

const log: debug.IDebugger = debug("app:series-controller");

class SeriesController {
    private seriesService: SeriesService = new SeriesService();
    async listSeries(req: express.Request, res: express.Response) {
        const series = await this.seriesService.list(100, 0);

        res.status(series.statusCode).send(series);
    }

    async getSeriesById(req: express.Request, res: express.Response) {
        const series = await this.seriesService.readById(req.body.series_id);

        res.status(series.statusCode).send(series);
    }

    async getSeriesByIdAndCalendarId(
        req: express.Request,
        res: express.Response
    ) {
        const series = await this.seriesService.readByIdAndCalendarId(
            req.body.series_id,
            req.body.calendar_id
        );

        res.status(series.statusCode).send(series);
    }

    async createSeries(req: express.Request, res: express.Response) {
        const series = await this.seriesService.create(req.body);

        res.status(series.statusCode).send(series);
    }

    async patch(req: express.Request, res: express.Response) {
        const series = await this.seriesService.patchById(
            req.body.series_id,
            req.body
        );

        res.status(series.statusCode).send(series);
    }

    async put(req: express.Request, res: express.Response) {
        const series = await this.seriesService.putById(
            req.body.series_id,
            req.body
        );

        res.status(series.statusCode).send(series);
    }

    async removeSeries(req: express.Request, res: express.Response) {
        const series = await this.seriesService.deleteById(req.body.series_id);

        res.status(series.statusCode).send(series);
    }
}

export default SeriesController;
