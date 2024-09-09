import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerService } from 'src/utils/logger.services';
import { UserRepository } from './user.repository';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, CustomLoggerService, UserRepository],
  exports:[TypeOrmModule]
})
export class UserModule {}
