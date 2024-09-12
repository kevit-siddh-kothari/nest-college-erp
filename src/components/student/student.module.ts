import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { RoleGuard } from 'src/guards/authorization.guard';
import { AuthenticationMiddleware } from 'src/middlewear/auth.middlewar';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity,
      DepartmentEntity,
      BatchEntity,
      AttendanceEntity,
    ]),
    UserModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository, RoleGuard, UserRepository],
  exports: [TypeOrmModule],
})
export class StudentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('student');
  }
}
