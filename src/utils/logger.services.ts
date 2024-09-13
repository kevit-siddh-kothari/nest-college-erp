import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * CustomLoggerService extends the NestJS Logger class to provide custom logging capabilities.
 * It uses Winston for logging to both the console and rotating log files.
 */
@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
  private fileLogger: winston.Logger;

  /**
   * Initializes the CustomLoggerService.
   * Sets up Winston for logging to the console and rotating log files.
   */
  constructor() {
    super();

    this.fileLogger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.DailyRotateFile({
          filename: 'application-%DATE%.log',
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  /**
   * Logs a message at the "log" level.
   * @param message - The message to log.
   */
  log(message: string) {
    super.log(message);
    this.fileLogger.info(message);
  }

  /**
   * Logs an error message and stack trace.
   * @param message - The error message to log.
   * @param trace - The stack trace to log.
   */
  error(message: string, trace: string) {
    this.fileLogger.error(message, { trace });
    super.error(message, trace);
  }

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   */
  warn(message: string) {
    super.warn(message);
    this.fileLogger.warn(message);
  }

  /**
   * Logs a debug message.
   * @param message - The debug message to log.
   */
  debug(message: string) {
    super.debug(message);
    this.fileLogger.debug(message);
  }

  /**
   * Logs a verbose message.
   * @param message - The verbose message to log.
   */
  verbose(message: string) {
    super.verbose(message);
    this.fileLogger.verbose(message);
  }
}
