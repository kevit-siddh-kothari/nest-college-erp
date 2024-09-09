import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './entity/attendance.entity';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity]), StudentModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [TypeOrmModule]
})
export class AttendanceModule {}
