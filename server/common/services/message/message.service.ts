import { log } from "winston";

export interface IMessage {
    success: boolean;
    message: string;
}

interface ISuccessPayload extends IMessage {
    data?: any;
    statusCode: number;
}

interface IErrorPayload extends IMessage {
    error?: any;
    statusCode: number;
}

export type ServerResponsePayload = ISuccessPayload & IErrorPayload;

export const sendSuccess = (
    message: string,
    data: any = [],
    statusCode: number = 200
): ISuccessPayload => {
    log("info", message);
    return {
        success: true,
        message: message,
        data: data,
        statusCode: statusCode,
    };
};

export const sendFailure = (
    message: string,
    error: any,
    statusCode: number = 400
): IErrorPayload => {
    log("error", message);
    return {
        success: false,
        message,
        error,
        statusCode,
    };
};
