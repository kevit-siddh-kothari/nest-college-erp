import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import { UserService } from './user.service';
import { CustomLoggerService } from '../../utils/logger.services';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AuthenticationMiddleware } from '../../middlewear/auth.middlewar';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

describe('UserController', () => {
  let controller: UserController;
  let dataSource: DataSource;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'root',
          password: 'Siddh@72003',
          database: 'college_testing1',
          entities: [UserEntity, TokenEntity],
        }),
        TypeOrmModule.forFeature([UserEntity, TokenEntity]),
      ],
      controllers: [UserController],
      providers: [UserService, CustomLoggerService, UserRepository],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
  }, 10000);

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user and token on successful sign-up', async () => {
    const dto: CreateUserDto = { username: 'test@mail.com', password: 'password', role: UserRole.Admin };
    const result: unknown = { user: dto, token: 'fake-token' };
    
    jest.spyOn(service, 'signUp').mockResolvedValue(result);
    
    const response = await controller.signUp(dto);
    expect(response).toEqual(result);
  });

  it('should return user and token on successful login', async () => {
    const dto: UpdateUserDto = { username: 'test@mail.com', password: 'password', role: UserRole.Admin };
    const result = { user: dto, token: 'fake-token' };
    
    jest.spyOn(service, 'logIn').mockResolvedValue(result);
    
    const response = await controller.logIn(dto);
    expect(response).toEqual(result);
  });

  it('should log out the user successfully', async () => {
    const req: AuthenticatedRequest = {
      user: { id: '1' } as TokenEntity,
      token: 'fake-token',
    } as any;
    const res = { send: jest.fn() } as any as Response;
    
    jest.spyOn(service, 'logOut').mockResolvedValue('');
    
    await controller.logOut(req, res);
    
    expect(service.logOut).toHaveBeenCalledWith(req, res);
    expect(res.send).toHaveBeenCalledWith('logged out successfully!');
  });

  it('should log out from all devices successfully', async () => {
    const req: AuthenticatedRequest = {
      user: { id: '1' } as TokenEntity,
      token: 'fake-token',
    } as any;
    const res = { send: jest.fn() } as any as Response;
    
    jest.spyOn(service, 'logOutAll').mockResolvedValue('');
    
    await controller.logoutAll(req, res);
    
    expect(service.logOutAll).toHaveBeenCalledWith(req, res);
    expect(res.send).toHaveBeenCalledWith('logged out from all devices!');
  });
});
