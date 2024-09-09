import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from 'src/components/student/student.module';
import { DepartmentModule } from 'src/components/department/department.module';
import { BatchModule } from 'src/components/batch/batch.module';
import { AttendanceModule } from 'src/components/attendance/attendance.module';
import { UserModule } from 'src/components/user/user.module';
import { StudentEntity } from '../components/student/entity/student.entity';
import { DepartmentEntity } from '../components/department/entity/department.entity';
import { BatchEntity } from '../components/batch/entity/batch.year.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';
import { UserEntity } from 'src/components/user/entity/user.entity';
import { BatchDetailsEntity } from 'src/components/batch/entity/batch.details.entity';
import { TokenEntity } from 'src/components/user/entity/token.entity';

@Module({
  imports: [
    UserModule,
    BatchModule,
    DepartmentModule,
    StudentModule,
    AttendanceModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'postgres'
      host: '127.0.0.1',
      port: 3307, // change for postgres
      username: 'root',
      password: 'Root@72003',
      database: 'college_db',
      entities: [StudentEntity, DepartmentEntity, BatchEntity, AttendanceEntity, UserEntity, BatchDetailsEntity, TokenEntity], // Specify your entities
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
