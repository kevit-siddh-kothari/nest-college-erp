import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../components/user/user.repository'; // Import UserRepository
import { UserEntity } from 'src/components/user/entity/user.entity';
import { UpdateUserDto } from 'src/components/user/dto/update-user.dto';
import { TokenEntity } from 'src/components/user/entity/token.entity';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userRepository: UserRepository) {}

  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '').trim();
      
      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

      // Verify the token and extract the payload
      const decoded = jwt.verify(
        token,
        'siddhkothari',
      ) as { id: string };
     
      // Perform the TypeORM findOne operation using the UserRepository
      const user = await this.userRepository.isAuthenticated(decoded.id, token);
      
      if (!user) {
        throw new UnauthorizedException('Authentication failed');
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).send('Please authenticate');
    }
  }
}
