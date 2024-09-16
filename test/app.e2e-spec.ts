import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StudentEntity } from 'src/components/student/entity/student.entity';
import { DepartmentEntity } from 'src/components/department/entity/department.entity';
import { BatchEntity } from 'src/components/batch/entity/batch.year.entity';
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';
import { UserEntity } from 'src/components/user/entity/user.entity';
import { BatchDetailsEntity } from 'src/components/batch/entity/batch.details.entity';
import { TokenEntity } from 'src/components/user/entity/token.entity';
import { UserModule } from 'src/components/user/user.module';
import { BatchModule } from 'src/components/batch/batch.module';
import { DepartmentModule } from 'src/components/department/department.module';
import { StudentModule } from 'src/components/student/student.module';
import { AttendanceModule } from 'src/components/attendance/attendance.module';
import { StudentInfModule } from 'src/components/student-inf/student-inf.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        BatchModule,
        DepartmentModule,
        StudentModule,
        AttendanceModule,
        StudentInfModule,
        TypeOrmModule.forRoot({
          type: 'mysql', // or 'postgres'
          host: '127.0.0.1',
          port: 3306, // change for postgres
          username: 'root',
          password: 'Root@72003',
          database: 'college_db',
          entities: [
            StudentEntity,
            DepartmentEntity,
            BatchEntity,
            AttendanceEntity,
            UserEntity,
            BatchDetailsEntity,
            TokenEntity,
          ], // Specify your entities
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
