import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
    private fileLogger: winston.Logger;

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

    log(message: string) {
        super.log(message);
        this.fileLogger.info(message);
    }

    error(message: string, trace: string) {
        this.fileLogger.error(message, { trace });
        super.error(message, trace);
    }

    warn(message: string) {
        super.warn(message);
        this.fileLogger.warn(message);
    }

    debug(message: string) {
        super.debug(message);
        this.fileLogger.debug(message);
    }

    verbose(message: string) {
        super.verbose(message);
        this.fileLogger.verbose(message);
    }
}
