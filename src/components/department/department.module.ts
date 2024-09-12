import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from './entity/department.entity';
import { DepartmentRepository } from './department.repository';
import { AuthenticationMiddleware } from 'src/middlewear/auth.middlewar';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity]), UserModule],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRepository, UserRepository],
  exports: [TypeOrmModule],
})
export class DepartmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('department');
  }
}
