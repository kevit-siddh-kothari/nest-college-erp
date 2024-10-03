import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from './entity/student.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchEntity } from '../batch/entity/batch.year.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRep: Repository<StudentEntity>,

    @InjectRepository(DepartmentEntity)
    private departmentRepo: Repository<DepartmentEntity>,

    @InjectRepository(BatchEntity)
    private batchRepo: Repository<BatchEntity>,

    @InjectRepository(AttendanceEntity)
    private attendanceRepo: Repository<AttendanceEntity>,
  ) {}

  /**
   * Retrieves all student records.
   *
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   */
  public async getAllStudents(): Promise<StudentEntity[]> {
    return await this.studentRep.find();
  }

  /**
   * Retrieves a student record by ID.
   *
   * @param id - The ID of the student to retrieve.
   * @returns A promise that resolves to the `StudentEntity` with the specified ID.
   * @throws NotFoundException if no student with the specified ID is found.
   */
  public async getStudentById(id: string): Promise<StudentEntity> {
    const studentEntity = await this.studentRep.findOne({ where: { id: id } });
    if (!studentEntity) {
      throw new NotFoundException(`No student exists with ID ${id}`);
    }
    return studentEntity;
  }

  /**
   * Retrieves a department record by ID.
   *
   * @param id - The ID of the department to retrieve.
   * @returns A promise that resolves to the `DepartmentEntity` with the specified ID.
   * @throws NotFoundException if no department with the specified ID is found.
   */
  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    const departmentEntity = await this.departmentRepo.findOne({
      where: { id: id },
    });
    if (!departmentEntity) {
      throw new NotFoundException(`No department exists with ID ${id}`);
    }
    return departmentEntity;
  }

  /**
   * Retrieves a batch record by ID.
   *
   * @param id - The ID of the batch to retrieve.
   * @returns A promise that resolves to the `BatchEntity` with the specified ID.
   * @throws NotFoundException if no batch with the specified ID is found.
   */
  public async getBatchEntityById(id: string): Promise<BatchEntity> {
    const batch = await this.batchRepo.findOne({ where: { id: id } });
    if (!batch) {
      throw new NotFoundException(`No batch exists with ID ${id}`);
    }
    return batch;
  }

  /**
   * Creates a new student record.
   *
   * @param student - The student data to be created.
   * @param BatchEntity - The batch entity to associate with the student.
   * @param DepartmentEntity - The department entity to associate with the student.
   * @returns A promise that resolves to the created `StudentEntity`.
   */
  public async createStudent(
    student,
    BatchEntity,
    DepartmentEntity,
  ): Promise<StudentEntity> {
    const StudentEntity = await this.studentRep.create({
      username: student.username,
      name: student.name,
      phno: student.phno,
      currentSem: student.currentsem,
      department: DepartmentEntity,
      batch: BatchEntity,
    });
    return await this.studentRep.save(StudentEntity);
  }

  /**
   * Updates an existing student record by ID.
   *
   * @param student - The updated student data.
   * @param id - The ID of the student to update.
   * @returns A promise that resolves to the updated `StudentEntity` array.
   * @throws NotFoundException if no student with the specified ID is found.
   */
  public async updateStudent(student, id: string): Promise<StudentEntity[]> {
    const existingStudent = await this.studentRep.findOne({
      where: { id: id },
    });
    if (!existingStudent) {
      throw new NotFoundException(`No student exists with ID ${id}`);
    }
    const updatedResult = await this.studentRep.merge(existingStudent, student);
    await this.studentRep.save(updatedResult);
    return this.studentRep.find({ where: { id: id } });
  }

  /**
   * Deletes a student record by ID.
   *
   * @param id - The ID of the student to delete.
   * @returns A promise that resolves to an array of remaining `StudentEntity` objects.
   * @throws NotFoundException if no student with the specified ID is found.
   */
  public async deleteStudent(id: string): Promise<StudentEntity[]> {
    const student = await this.studentRep.findOne({ where: { id: id } });
    if (!student) {
      throw new NotFoundException(`No student exists with ID ${id}`);
    }
    await this.studentRep.delete({ id: id });
    return this.getAllStudents();
  }

  /**
   * Deletes all student records.
   *
   * @returns A promise that resolves to an object with a success message.
   */
  public async deleteAllStudent(): Promise<{ message: string }> {
    await this.studentRep
      .createQueryBuilder()
      .delete()
      .from(StudentEntity)
      .execute();
    return { message: 'Students deleted successfully' };
  }

  /**
   * Retrieves analytics data for students.
   *
   * @returns A promise that resolves to an array of objects representing analytics data.
   */
  public async getAnalyticsData(): Promise<unknown[]> {
    const results = await this.studentRep
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('student.batch', 'batch')
      .select('batch.year', 'year')
      .addSelect('department.name', 'branch')
      .addSelect('COUNT(student.id)', 'totalStudents')
      .groupBy('batch.year')
      .addGroupBy('department.name')
      .orderBy('batch.year', 'ASC')
      .getRawMany();

    const analyticsData = results.reduce(
      (acc, row) => {
        const year = row.year;
        const branch = row.branch;
        const totalStudents = parseInt(row.totalStudents, 10);

        if (!acc[year]) {
          acc[year] = { year, totalStudents: 0, branches: {} };
        }

        acc[year].totalStudents += totalStudents;
        acc[year].branches[branch] =
          (acc[year].branches[branch] || 0) + totalStudents;

        return acc;
      },
      {} as Record<
        string,
        {
          year: string;
          totalStudents: number;
          branches: Record<string, number>;
        }
      >,
    );

    return Object.values(analyticsData);
  }

  /**
   * Counts the number of students in a specific batch year.
   *
   * @param year - The year of the batch to count students for.
   * @returns A promise that resolves to the count of students in the specified batch year.
   */
  public async countStudentsByBatch(year: string): Promise<number> {
    return await this.studentRep
      .createQueryBuilder('student')
      .leftJoin('student.batch', 'batch')
      .where('batch.year = :year', { year })
      .getCount();
  }

  /**
   * Retrieves batch data based on year and/or department ID.
   *
   * @param year - The year of the batch to retrieve (optional).
   * @param departmentId - The ID of the department to filter by (optional).
   * @returns A promise that resolves to an array of `BatchEntity` objects.
   */
  public async findBatchData(
    year?: string,
    departmentId?: string,
  ): Promise<BatchEntity[]> {
    const queryBuilder = this.batchRepo
      .createQueryBuilder('batch')
      .leftJoinAndSelect('batch.yearId', 'batchDetails')
      .leftJoinAndSelect('batchDetails.department', 'department');

    if (year) {
      queryBuilder.andWhere('batch.year = :year', { year });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', { departmentId });
    }

    return await queryBuilder.getMany();
  }

  /**
   * Retrieves attendance data based on date, department ID, batch ID, and/or semester.
   *
   * @param date - The date to filter attendance records (optional).
   * @param department - The department ID to filter by (optional).
   * @param batch - The batch ID to filter by (optional).
   * @param currentsem - The semester to filter by (optional).
   * @returns A promise that resolves to an array of `AttendanceEntity` objects.
   * @throws BadRequestException if the date format is invalid.
   */
  public async findAttendanceData(
    date?: string,
    department?: string,
    batch?: string,
    currentsem?: string,
  ): Promise<AttendanceEntity[]> {
    console.log(date);
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException({
        message: 'Invalid date format. Date must be in yyyy-MM-dd format.',
      });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const startOfDayStr = startOfDay
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const endOfDayStr = endOfDay.toISOString().slice(0, 19).replace('T', ' ');

    const queryBuildder: SelectQueryBuilder<AttendanceEntity> =
      await this.attendanceRepo
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'students')
        .leftJoinAndSelect('students.batch', 'batchs')
        .leftJoinAndSelect('students.department', 'departments')
        .where('attendance.isPresent = :value', { value: true });

    if (date) {
      queryBuildder.andWhere(
        'attendance.created_at BETWEEN :startOfDay AND :endOfDay',
        {
          startOfDay: startOfDayStr,
          endOfDay: endOfDayStr,
        },
      );
    }

    if (department) {
      queryBuildder.andWhere('departments.id = :department', { department });
    }
    if (batch) {
      queryBuildder.andWhere('batchs.id = :batch', { batch });
    }
    if (currentsem) {
      queryBuildder.andWhere('students.currentSem = :currentsem', {
        currentsem,
      });
    }

    return await queryBuildder.getMany();
  }

  /**
   * Retrieves students with less than 75% attendance.
   *
   * @param department - The department ID to filter by (optional).
   * @param batch - The batch ID to filter by (optional).
   * @param currentsem - The semester to filter by (optional).
   * @returns A promise that resolves to an array of objects representing students with less than 75% attendance.
   */
  public async findPresentLessThan75(
    department?: string,
    batch?: string,
    currentsem?: string,
  ) {
    const queryBuilder: SelectQueryBuilder<AttendanceEntity> =
      this.attendanceRepo
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'students')
        .leftJoinAndSelect('students.batch', 'batchs')
        .leftJoinAndSelect('students.department', 'departments')
        .where('attendance.isPresent = :value', { value: true });

    if (department) {
      queryBuilder.andWhere('departments.id = :department', { department });
    }
    if (batch) {
      queryBuilder.andWhere('batchs.id = :batch', { batch });
    }
    if (currentsem) {
      queryBuilder.andWhere('students.currentSem = :currentsem', {
        currentsem,
      });
    }

    queryBuilder
      .select('students.id', 'studentId')
      .addSelect('students.name', 'studentName')
      .addSelect('COUNT(attendance.id)', 'TotalPresent')
      .groupBy('students.id')
      .addGroupBy('students.name');

    const results = await queryBuilder.getRawMany();

    return results;
  }
}
