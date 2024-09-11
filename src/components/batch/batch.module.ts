import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from './entity/batch.year.entity';
import { BatchRepository } from './batch.repository';
import { BatchDetailsModule } from './batch-details/batch-details.module';

@Module({
  imports: [TypeOrmModule.forFeature([BatchEntity]), BatchDetailsModule],
  controllers: [BatchController],
  providers: [BatchService, BatchRepository],
  exports: [TypeOrmModule]
})
export class BatchModule {}
