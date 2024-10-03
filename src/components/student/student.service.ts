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

  /**
   * Creates a new student record.
   * Validates the existence of the department and batch, then creates a student entity.
   *
   * @param createStudentDto - DTO containing student details to be created.
   * @returns A promise that resolves to the created `StudentEntity`.
   * @throws NotFoundException if the department or batch does not exist.
   * @throws InternalServerErrorException if an error occurs during creation.
   */
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

  /**
   * Retrieves all student records.
   *
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
  public async findAll(): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.getAllStudents();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves a student record by ID.
   *
   * @param id - The ID of the student to retrieve.
   * @returns A promise that resolves to the `StudentEntity` with the specified ID.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
  public async findOne(id: string): Promise<StudentEntity> {
    try {
      return await this.studentRepository.getStudentById(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Updates a student record by ID.
   *
   * @param id - The ID of the student to update.
   * @param updateStudentDto - DTO containing the updated student details.
   * @returns A promise that resolves to the updated `StudentEntity` array.
   * @throws InternalServerErrorException if an error occurs during update.
   */
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

  /**
   * Removes a student record by ID.
   *
   * @param id - The ID of the student to remove.
   * @returns A promise that resolves to the removed `StudentEntity` array.
   * @throws InternalServerErrorException if an error occurs during removal.
   */
  public async remove(id: string): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.deleteStudent(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Removes all student records.
   *
   * @returns A promise that resolves to an object with a success message.
   * @throws InternalServerErrorException if an error occurs during removal.
   */
  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.studentRepository.deleteAllStudent();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves analytics data for students.
   *
   * @returns A promise that resolves to the analytics data.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
  public async getAnalyticsData() {
    try {
      return await this.studentRepository.getAnalyticsData();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves the number of vacant seats based on the query parameters.
   *
   * @param queryObject - An object containing query parameters such as department and batch.
   * @returns A promise that resolves to an array of objects representing vacant seats.
   * @throws NotFoundException if no batch data is found.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
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

  /**
   * Retrieves students who were absent on a specific date based on the query parameters.
   *
   * @param queryObject - An object containing query parameters such as departmentId, batchId, and semester.
   * @param date - The date to filter attendance records.
   * @returns A promise that resolves to an array of `AttendanceEntity` objects or an error object.
   * @throws NotFoundException if no attendance records are found.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
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

  /**
   * Retrieves students who have attended less than 75% of classes based on the query parameters.
   *
   * @param query - An object containing query parameters such as departmentId, batchId, and semester.
   * @returns A promise that resolves to an array of students who have attended less than 75% of classes.
   * @throws NotFoundException if no attendance records are found.
   * @throws InternalServerErrorException if an error occurs during retrieval.
   */
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
      const result = [];
      for (const attendance of attendanceRecords) {
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
