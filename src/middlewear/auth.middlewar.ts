import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../components/user/user.repository'; // Import UserRepository
import { TokenEntity } from '../components/user/entity/token.entity';
import { CustomLoggerService } from '../utils/logger.services';
import { HttpExceptionFilter } from '../exception/http-exception.filter';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthenticationMiddleware implements NestMiddleware {
  /**
   * Creates an instance of AuthenticationMiddleware.
   * @param userRepository - Repository for handling user authentication.
   * @param configService - Service to access application configuration.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Middleware to authenticate requests using JWT tokens.
   * @param req - The request object, extended to include user and token properties.
   * @param res - The response object.
   * @param next - Function to pass control to the next middleware or route handler.
   * @throws NotFoundException if the token is missing.
   * @throws UnauthorizedException if authentication fails.
   * @throws InternalServerErrorException for any unexpected errors.
   */
  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const logger = new CustomLoggerService();
    try {
      // Extract the token from the Authorization header
      const token: string = req
        .header('Authorization')
        ?.replace('Bearer ', '')
        .trim();

      // Check if the token is missing
      if (!token) {
        throw new NotFoundException('Token is missing');
      }

      logger.log(`Token extracted successfully`);

      // Verify the token using the secret key
      const decoded = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRETKEY'),
      ) as { id: string };

      // Check if token verification failed
      if (!decoded) {
        throw new UnauthorizedException('Authentication failed');
      }

      // Check if the user is authenticated
      const user: TokenEntity = await this.userRepository.isAuthenticated(
        decoded.id,
        token,
      );

      // Check if the user is not found or not authenticated
      if (!user) {
        throw new UnauthorizedException('Authentication failed');
      }

      logger.log(`Request object updated with user and token`);

      // Attach user and token to the request object
      req.user = user;
      req.token = token;
      next();
    } catch (error: any) {
      // Handle errors, throw appropriate HTTP exceptions
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
