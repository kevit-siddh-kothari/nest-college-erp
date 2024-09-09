import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity } from './entity/department.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DepartmentEntity])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [TypeOrmModule]
})
export class DepartmentModule {}
