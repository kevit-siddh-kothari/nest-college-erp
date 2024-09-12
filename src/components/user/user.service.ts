import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import { Response } from 'express';
import { UserRepository } from './user.repository';
import { compareSync } from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { TokenEntity } from './entity/token.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private userRepo: UserRepository) {}

  public async signUp(
    user: CreateUserDto,
  ): Promise<{ message?: string; error?: string }> {
    try {
      await this.userRepo.addUser(user);
      this.logger.log(`User created successfully`);
      return { message: 'User created successfully' };
    } catch (error: any) {
      this.logger.error(`Error during sign-up: ${error.message}`);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async logIn(
    user: UpdateUserDto,
  ): Promise<{ user: UpdateUserDto; token: string }> {
    try {
      const entity: UserEntity = await this.userRepo.findByUsername(
        user.username,
      );
      if (!entity) {
        this.logger.error(`User not found`);
        throw new NotFoundException({
          message: `User Not Found Please Enter Correct Username!`,
        });
      }
      const match: boolean = compareSync(user.password, entity.password);
      if (match) {
        const token: string = jwt.sign({ id: entity.id }, 'siddhkothari');
        await this.userRepo.addUserToken(entity.id, token);
        this.logger.log(`Token added Sucessfully !`);
        return { user, token };
      } else {
        this.logger.error(`Password is Incorrect`);
        throw new NotFoundException({
          message: `Password is Incorrect Please Enter Correct Password!`,
        });
      }
    } catch (error: any) {
      this.logger.error(`Error during log-in: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async logOut(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<String | { message: string }> {
    try {
      if (!req.user || !req.token) {
        this.logger.error('User or token not found');
        throw new NotFoundException({ message: `User or token not found` });
      }
      if (req.user && req.token) {
        await this.userRepo.deleteToken(req.token, req.user);
        this.logger.warn(`logged out sucessfully`);
        return { message: 'Logged out successfully' };
      }
    } catch (error: any) {
      this.logger.error(`Error during log-out: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async logOutAll(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<string | { message: string }> {
    try {
      if (req.user) {
        await this.userRepo.deleteAllToken(req.user);
        this.logger.warn(`logged of all the devices`);
        return { message: 'Logged out from all devices successfully' };
      } else {
        this.logger.error('User or token not found');
        throw new NotFoundException({ message: `User or token not found` });
      }
    } catch (error: any) {
      this.logger.error(`Error during log-out: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
