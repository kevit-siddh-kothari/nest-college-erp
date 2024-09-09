import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const contex: HttpArgumentsHost = host.switchToHttp();
        const request = contex.getRequest<Request>();
        const response = contex.getResponse<Response>();
        const status: number = exception.getStatus();
        const message: string = exception.message;

        const body = {
            statusCode: status,
            timestamps: new Date().toISOString(),
            message: message,
            path: request.url
        }

        response.status(status).json(body);
    }
}