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
  constructor(private readonly userRepository: UserRepository, private configService: ConfigService) {}

  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const logger = new CustomLoggerService();
    try {
      const token: string = req.header('Authorization')?.replace('Bearer ', '').trim();
      
      if (!token) {
        throw new NotFoundException('Token is missing');
      }
      logger.log(`token generated sucessfully !`);
      const decoded = jwt.verify(token, this.configService.get<string>('JWT_SECRETKEY')) as { id: string };

      if(!decoded){
        throw new UnauthorizedException('Authentication failed');
      }

      const user: TokenEntity = await this.userRepository.isAuthenticated(decoded.id, token);

      if (!user) {
        throw new UnauthorizedException('Authentication failed');
      }

      logger.log(`request object updated with use and token !`);
      req.user = user;
      req.token = token;
      next();
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error;
      };
      throw new InternalServerErrorException({message:error.message});
    }
  }
}
