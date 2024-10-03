import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BatchDetailsService } from './batch-details.service';
import { BatchDetailsController } from './batch-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchDetailsEntity } from '../entity/batch.details.entity';
import { DepartmentEntity } from 'src/components/department/entity/department.entity';
import { BatchEntity } from '../entity/batch.year.entity';
import { BatchDetailsRepository } from './batch-details.repository';
import { AuthenticationMiddleware } from 'src/middlewear/auth.middlewar';
import { UserModule } from 'src/components/user/user.module';
import { UserRepository } from 'src/components/user/user.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      BatchDetailsEntity,
      DepartmentEntity,
      BatchEntity,
    ]),
  ],
  controllers: [BatchDetailsController],
  providers: [BatchDetailsService, BatchDetailsRepository, UserRepository],
  exports: [TypeOrmModule, BatchDetailsRepository],
})
export class BatchDetailsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('batch-details');
  }
}
