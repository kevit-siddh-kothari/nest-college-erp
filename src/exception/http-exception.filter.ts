import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../utils/logger.services';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new CustomLoggerService();
    const contex: HttpArgumentsHost = host.switchToHttp();
    const request = contex.getRequest<Request>();
    const response = contex.getResponse<Response>();
    const status: number = exception.getStatus();
    const message: string = exception.message;
    logger.error(message,'');
    const body = {
      statusCode: status,
      timestamps: new Date().toISOString(),
      message: message,
      path: request.url,
    };

    response.status(status).json(body);
  }
}
