import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerService } from 'src/utils/logger.services';
import { UserRepository } from './user.repository';
import { TokenEntity } from './entity/token.entity';
import { AuthenticationMiddleware } from 'src/middlewear/auth.middlewar';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity])],
  controllers: [UserController],
  providers: [UserService, CustomLoggerService, UserRepository, ConfigService],
  exports: [TypeOrmModule],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'user/logout', method: RequestMethod.POST },
        { path: 'user/logoutAll', method: RequestMethod.POST },
      ); // Apply the middleware globally or to specific routes
  }
}
