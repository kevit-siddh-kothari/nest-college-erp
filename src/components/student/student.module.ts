import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entity/student.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchEntity } from '../batch/entity/batch.year.entity';
import { StudentRepository } from './student.repository';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';

@Module({
  imports : [TypeOrmModule.forFeature([StudentEntity, DepartmentEntity, BatchEntity, BatchDetailsEntity]), UserModule],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [TypeOrmModule]
})
export class StudentModule {}
