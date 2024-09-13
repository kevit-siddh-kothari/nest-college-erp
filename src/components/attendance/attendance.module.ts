import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from './entity/attendance.entity';
import { StudentModule } from '../student/student.module';
import { StudentEntity } from '../student/entity/student.entity';
import { AttendanceRepository } from './attendance.repository';
import { AuthenticationMiddleware } from '../../middlewear/auth.middlewar';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceEntity, StudentEntity]),
    StudentModule,
    UserModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository, UserRepository],
  exports: [TypeOrmModule],
})
export class AttendanceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('attendance');
  }
}
