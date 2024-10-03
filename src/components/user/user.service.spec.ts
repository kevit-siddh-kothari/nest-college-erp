import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, UserRole } from './entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import * as jwt from 'jsonwebtoken';

import * as bcrypt from 'bcrypt';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

jest.mock('bcrypt', () => ({
  compareSync: jest.fn(), // Mock compareSync as a Jest function
}));

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepository;
  // let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            addUser: jest.fn(),
            findByUsername: jest.fn(),
            addUserToken: jest.fn(),
            deleteToken: jest.fn(),
            deleteAllToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<UserRepository>(UserRepository);
    // configService = module.get<ConfigService>(ConfigService);
  });

  describe('signUp', () => {
    it('should create a user and return success message', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test@mail.com',
        password: 'password',
        role: UserRole.ADMIN,
      };

      jest.spyOn(userRepo, 'addUser').mockResolvedValue(undefined);

      const result = await service.signUp(createUserDto);
      expect(userRepo.addUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });

    it('should throw InternalServerErrorException on failure', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test@mail.com',
        password: 'password',
        role: UserRole.ADMIN,
      };

      jest
        .spyOn(userRepo, 'addUser')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.signUp(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('logIn', () => {
    it('should log in user and return token', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'test@mail.com',
        password: 'password',
      };
      const userEntity: UserEntity = {
        id: '1',
        username: 'test@mail.com',
        password: 'hashed-password',
      } as UserEntity;
      const token: any = 'test-token';

      jest.spyOn(userRepo, 'findByUsername').mockResolvedValue(userEntity);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue(token);
      jest.spyOn(userRepo, 'addUserToken').mockResolvedValue(undefined);

      const result = await service.logIn(updateUserDto);
      expect(result).toEqual({ user: updateUserDto, token });
    });

    it('should throw NotFoundException if user not found', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'nonexistent@mail.com',
        password: 'password',
      };
      jest.spyOn(userRepo, 'findByUsername').mockResolvedValue(null);

      await expect(service.logIn(updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if password is incorrect', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'test@mail.com',
        password: 'wrong-password',
      };
      const userEntity: UserEntity = {
        id: '1',
        username: 'test@mail.com',
        password: 'hashed-password',
      } as UserEntity;

      jest.spyOn(userRepo, 'findByUsername').mockResolvedValue(userEntity);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(service.logIn(updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('logOut', () => {
    it('should log out user successfully', async () => {
      const req = { user: { id: '1' }, token: 'token' } as AuthenticatedRequest;

      jest.spyOn(userRepo, 'deleteToken').mockResolvedValue(undefined);

      const result = await service.logOut(req);
      expect(userRepo.deleteToken).toHaveBeenCalledWith(req.token, req.user);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw NotFoundException if user or token is missing', async () => {
      const req = { user: null, token: null } as AuthenticatedRequest;

      await expect(service.logOut(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('logOutAll', () => {
    it('should log out user from all devices', async () => {
      const req = { user: { id: '1' } } as AuthenticatedRequest;

      jest.spyOn(userRepo, 'deleteAllToken').mockResolvedValue(undefined);

      const result = await service.logOutAll(req);
      expect(userRepo.deleteAllToken).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({
        message: 'Logged out from all devices successfully',
      });
    });

    it('should throw NotFoundException if user is missing', async () => {
      const req = { user: null } as AuthenticatedRequest;

      await expect(service.logOutAll(req)).rejects.toThrow(NotFoundException);
    });
  });
});
