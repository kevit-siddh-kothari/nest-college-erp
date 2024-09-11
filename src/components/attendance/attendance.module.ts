import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './entity/attendance.entity';
import { StudentModule } from '../student/student.module';
import { StudentEntity } from '../student/entity/student.entity';
import { AttendanceRepository } from './attendance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity, StudentEntity]), StudentModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository],
  exports: [TypeOrmModule]
})
export class AttendanceModule {}
