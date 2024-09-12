import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';
import { BatchDetailsEntity } from 'src/components/batch/entity/batch.details.entity';
import { BatchEntity } from 'src/components/batch/entity/batch.year.entity';
import { DepartmentEntity } from 'src/components/department/entity/department.entity';
import { StudentEntity } from 'src/components/student/entity/student.entity';
import { TokenEntity } from 'src/components/user/entity/token.entity';
import { UserEntity } from 'src/components/user/entity/user.entity';

export const AppDatSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3307,
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
  ],
  synchronize: true,
});
