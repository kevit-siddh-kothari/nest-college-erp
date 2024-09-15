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
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';
import { UserEntity } from 'src/components/user/entity/user.entity';
import { BatchDetailsEntity } from 'src/components/batch/entity/batch.details.entity';
import { TokenEntity } from 'src/components/user/entity/token.entity';
import { StudentInfModule } from 'src/components/student-inf/student-inf.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    BatchModule,
    DepartmentModule,
    StudentModule,
    AttendanceModule,
    StudentInfModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          StudentEntity,
          DepartmentEntity,
          BatchEntity,
          AttendanceEntity,
          UserEntity,
          BatchDetailsEntity,
          TokenEntity,
        ],
        synchronize: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
