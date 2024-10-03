import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import { UserRepository } from './user.repository';
import { compareSync } from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { TokenEntity } from './entity/token.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    private userRepo: UserRepository,
    private configService: ConfigService,
  ) {}

  /**
   * Handles user sign-up by creating a new user in the database.
   * @param user - The user data transfer object containing user details for registration.
   * @returns A promise that resolves to an object containing a success message or an error message.
   */
  public async signUp(
    user: CreateUserDto,
  ): Promise<{ message?: string; error?: string }> {
    try {
      console.log('hi', user);
      await this.userRepo.addUser(user);
      this.logger.log(`User created successfully`);
      return { message: 'User created successfully' };
    } catch (error: any) {
      this.logger.error(`Error during sign-up: ${error.message}`);
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Handles user log-in by verifying credentials and generating a JWT token.
   * @param user - The user data transfer object containing username and password.
   * @returns A promise that resolves to an object containing the user details and a JWT token.
   * @throws {NotFoundException} If the user is not found or the password is incorrect.
   */
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
        const token: string = jwt.sign(
          { id: entity.id },
          this.configService.get<string>('JWT_SECRETKEY'),
        );
        await this.userRepo.addUserToken(entity.id, token);
        this.logger.log(`Token added Successfully!`);
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

  /**
   * Handles user log-out by removing the token from the database.
   * @param req - The request object containing user and token information.
   * @param res - The response object.
   * @returns A promise that resolves to a message indicating successful log-out.
   * @throws {NotFoundException} If the user or token is not found.
   */
  public async logOut(
    req: AuthenticatedRequest,
  ): Promise<string | { message: string }> {
    try {
      if (!req.user || !req.token) {
        this.logger.error('User or token not found');
        throw new NotFoundException({ message: `User or token not found` });
      }
      if (req.user && req.token) {
        await this.userRepo.deleteToken(req.token);
        this.logger.warn(`Logged out successfully`);
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

  /**
   * Handles log-out from all devices by removing all tokens for the user.
   * @param req - The request object containing user information.
   * @param res - The response object.
   * @returns A promise that resolves to a message indicating successful log-out from all devices.
   * @throws {NotFoundException} If the user is not found.
   */
  public async logOutAll(
    req: AuthenticatedRequest,
  ): Promise<string | { message: string }> {
    try {
      if (req.user) {
        await this.userRepo.deleteAllToken(req.user);
        this.logger.warn(`Logged out from all devices`);
        return { message: 'Logged out from all devices successfully' };
      } else {
        this.logger.error('User not found');
        throw new NotFoundException({ message: `User not found` });
      }
    } catch (error: any) {
      this.logger.error(
        `Error during log-out from all devices: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
