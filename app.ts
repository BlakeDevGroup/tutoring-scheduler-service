import express from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from "./server/common/common.routes.config";
import { UsersRoutes } from "./server/users/users.routes.config";
import CalendarRoutes from "./server/calendars/routes/calendar.router";
import { PaymentOverrideRoutes } from "./server/payment_overrides/payment_override.routes.config";
import { CancellationRoutes } from "./server/cancellations/cancellation.routes.config";
import { CompanyRoutes } from "./server/companies/routes/company.routes";
import debug from "debug";

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const port = 3500;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());

app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (process.env.DEBUG) {
    loggerOptions.meta = true;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));
routes.push(new CalendarRoutes(app));
routes.push(new PaymentOverrideRoutes(app));
routes.push(new CancellationRoutes(app));
routes.push(new CompanyRoutes(app));

routes.forEach((route) => {
    route.configureRoutes();
});

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
});

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });

    console.log(runningMessage);
});

export default app;
