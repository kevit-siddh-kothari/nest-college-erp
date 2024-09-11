import { Module } from '@nestjs/common';
import { BatchDetailsService } from './batch-details.service';
import { BatchDetailsController } from './batch-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchDetailsEntity } from '../entity/batch.details.entity';
import { DepartmentEntity } from 'src/components/department/entity/department.entity';
import { BatchEntity } from '../entity/batch.year.entity';
import { BatchDetailsRepository } from './batch-details.repository';

@Module({
  imports:[TypeOrmModule.forFeature([BatchDetailsEntity, DepartmentEntity, BatchEntity])],
  controllers: [BatchDetailsController],
  providers: [BatchDetailsService, BatchDetailsRepository],
  exports: [TypeOrmModule]
})
export class BatchDetailsModule {}
