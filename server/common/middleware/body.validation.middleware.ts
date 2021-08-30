import express from "express";
import { validationResult } from "express-validator";
import { sendFailure } from "../services/message/message.service";

class BodyValidationMiddleware {
    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const parameter: string = errors.array()[0].param;
            const value: string = errors.array()[0].value;
            const message: string = `Invalid Value for param: ${parameter} value: ${value}`;
            return res
                .status(400)
                .send(sendFailure(message, new Error(message)));
        }
        next();
    }
}

export default new BodyValidationMiddleware();
