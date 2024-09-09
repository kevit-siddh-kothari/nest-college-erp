import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './entity/student.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';

@Module({
  imports : [TypeOrmModule.forFeature([StudentEntity]), UserModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [TypeOrmModule]
})
export class StudentModule {}
