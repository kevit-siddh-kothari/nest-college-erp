import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { StudentEntity } from './entity/student.entity';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';
import { BatchEntity } from '../batch/entity/batch.year.entity';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  public async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentEntity> {
    try {
      const departmentEntity = await this.studentRepository.getDepartmentById(
        createStudentDto.department,
      );

      if (!departmentEntity) {
        throw new NotFoundException({
          message: `No department with specific departmentId ${createStudentDto.department} exists !`,
        });
      }

      const batchEntity = await this.studentRepository.getBatchEntityById(
        createStudentDto.batchID,
      );

      if (!batchEntity) {
        throw new NotFoundException({
          message: `No batch with specific batchId ${createStudentDto.batchID} exists ! `,
        });
      }

      return this.studentRepository.createStudent(
        createStudentDto,
        batchEntity,
        departmentEntity,
      );
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findAll(): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findOne(id: string): Promise<StudentEntity> {
    try {
      return await this.studentRepository.getStudentById(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.updateStudent(updateStudentDto, id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async remove(id: string): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.deleteStudent(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.studentRepository.deleteAllStudent();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async getAnalyticsData() {
    try {
      return await this.studentRepository.getAnalyticsData();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async getVacantSeats(queryObject): Promise<any[]> {
    try {
      const departmentId: DepartmentEntity = queryObject.department
        ? await this.studentRepository.getDepartmentById(queryObject.department)
        : null;
      const arr: any[] = [];

      const batchData: BatchEntity[] =
        await this.studentRepository.findBatchData(
          queryObject.batch,
          departmentId ? departmentId.id : undefined,
        );
      if (!batchData.length) {
        throw new NotFoundException({ message: `batchData length is 0` });
      }

      for (const batch of batchData) {
        const batchObj: any = {
          year: batch.year,
          totalStudents: await this.studentRepository.countStudentsByBatch(
            batch.year,
          ),
          totalStudentsIntake: 0,
          availableIntake: 0,
          branches: batch.yearId.map((detail: BatchDetailsEntity) => ({
            branch: detail.department.name,
            totalStudentsIntake: parseInt(detail.totalStudentsIntake, 10),
            availableSeats: parseInt(detail.availableSeats, 10),
            occupiedSeats: parseInt(detail.occupiedSeats, 10),
          })),
        };

        batchObj.totalStudentsIntake = batchObj.branches.reduce(
          (acc, branch) => acc + branch.totalStudentsIntake,
          0,
        );
        batchObj.availableIntake = batchObj.branches.reduce(
          (acc, branch) => acc + branch.availableSeats,
          0,
        );

        arr.push(batchObj);
      }

      return arr;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async getAbsentStudents(
    queryObject,
    date: string,
  ): Promise<AttendanceEntity[] | { error: string }> {
    try {
      const attendanceRecords: AttendanceEntity[] =
        await this.studentRepository.findAttendanceData(
          date,
          queryObject.departmentId,
          queryObject.batchId,
          queryObject.sem,
        );
      if (!attendanceRecords.length) {
        throw new NotFoundException({ message: `attendance records is empty` });
      }
      return attendanceRecords;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async getPresentLessThan75(query) {
    try {
      const attendanceRecords =
        await this.studentRepository.findPresentLessThan75(
          query.departmentId,
          query.batchId,
          query.sem,
        );
      if (!attendanceRecords.length) {
        throw new NotFoundException({ message: `attendance records is empty` });
      }
      let result = [];
      for (let attendance of attendanceRecords) {
        if (attendance.TotalPresent < 23) {
          result.push(attendance);
        }
      }
      return result;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
