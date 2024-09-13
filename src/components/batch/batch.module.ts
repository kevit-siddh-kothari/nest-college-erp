import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from './entity/batch.year.entity';
import { BatchRepository } from './batch.repository';
import { BatchDetailsModule } from './batch-details/batch-details.module';
import { AuthenticationMiddleware } from '../../middlewear/auth.middlewar';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    BatchDetailsModule,
    UserModule,
  ],
  controllers: [BatchController],
  providers: [BatchService, BatchRepository, UserRepository],
  exports: [TypeOrmModule],
})
export class BatchModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('batch');
  }
}
