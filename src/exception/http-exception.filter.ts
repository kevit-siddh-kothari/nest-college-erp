import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../utils/logger.services';

/**
 * Exception filter that handles `HttpException` and formats the error response.
 * This filter is used to catch and handle exceptions thrown during HTTP requests.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Catches exceptions thrown during HTTP requests and formats the error response.
   * Logs the exception message using a custom logger.
   * @param exception - The `HttpException` that was thrown.
   * @param host - The `ArgumentsHost` used to access request and response objects.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new CustomLoggerService();
    const context: HttpArgumentsHost = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status: number = exception.getStatus();
    const message: string = exception.message;

    logger.error(message, '');

    const body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      path: request.url,
    };

    response.status(status).json(body);
  }
}
