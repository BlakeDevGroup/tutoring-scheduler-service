import express from "express";
import seriesService from "../services/series.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:series-controller");

class SeriesController {
    async listSeries(req: express.Request, res: express.Response) {
        const series = await seriesService.list(100, 0);

        res.status(200).send(series);
    }

    async getSeriesById(req: express.Request, res: express.Response) {
        const series = await seriesService.readById(req.body.seriesId);

        res.status(200).send(series);
    }

    async createSeries(req: express.Request, res: express.Response) {
        const series = await seriesService.create(req.body);

        res.status(200).send(series);
    }

    async patch(req: express.Request, res: express.Response) {
        log(await seriesService.patchById(req.body.seriesId, req.body));

        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        log(await seriesService.putById(req.body.seriesId, req.body));

        res.status(204).send();
    }

    async removeSeries(req: express.Request, res: express.Response) {
        log(await seriesService.deleteById(req.body.seriesId));

        res.status(204).send();
    }
}

export default new SeriesController();
