import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchEntity } from './entity/batch.year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BatchEntity])],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [TypeOrmModule]
})
export class BatchModule {}
