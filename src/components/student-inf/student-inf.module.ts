import { MiddlewareConsumer, Module } from '@nestjs/common';
import { StudentInfService } from './student-inf.service';
import { StudentInfController } from './student-inf.controller';
import { StudentInfRepository } from './student-inf.repositiry';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from '../student/entity/student.entity';
import { StudentModule } from '../student/student.module';
import { AuthenticationMiddleware } from 'src/middlewear/auth.middlewar';
import { UserRepository } from '../user/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    StudentModule,
    UserModule,
  ],
  controllers: [StudentInfController],
  providers: [StudentInfService, StudentInfRepository, UserRepository],
  exports: [TypeOrmModule],
})
export class StudentInfModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('student-inf');
  }
}
