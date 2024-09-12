import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from './entity/student.entity';
import { Batch, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchEntity } from '../batch/entity/batch.year.entity';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';
import { format, parse } from 'date-fns';

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

  public async getAllStudents(): Promise<StudentEntity[]> {
    return await this.studentRep.find();
  }

  public async getStudentById(id: string): Promise<StudentEntity> {
    const studentEntity=  await this.studentRep.findOne({ where: { id: id } });
    if(!studentEntity){
        throw new NotFoundException(`no student exists with ${id}`);
    }
    return studentEntity;
  }

  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    const departmentEntity =  await this.departmentRepo.findOne({ where: { id: id } });
    if(!departmentEntity){
        throw new NotFoundException(`no department exists with ${id}`);
    }
    return departmentEntity;
  }

  public async getBatchEntityById(id: string): Promise<BatchEntity> {
    const batch: BatchEntity =  await this.batchRepo.findOne({ where: { id: id } });
    if(!batch){
        throw new NotFoundException(`no batch exists with ${id}`);
    }
    return batch;
  }

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

  public async updateStudent(student, id: string): Promise<StudentEntity[]> {
    const existingStudent = await this.studentRep.findOne({
      where: { id: id },
    });
    const updatedResult = await this.studentRep.merge(existingStudent, student);
    await this.studentRep.save(updatedResult);
    return this.studentRep.find({ where: { id: id } });
  }

  public async deleteStudent(id: string): Promise<StudentEntity[]> {
    await this.studentRep.delete({ id: id });
    return this.getAllStudents();
  }

  public async deleteAllStudent(): Promise<{ message: string }> {
    await this.studentRep
      .createQueryBuilder()
      .delete()
      .from(StudentEntity)
      .execute();
    return { message: 'Student deleted sucessfully' };
  }

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

  public async countStudentsByBatch(year: string): Promise<number> {
    return await this.studentRep
      .createQueryBuilder('student')
      .leftJoin('student.batch', 'batch')
      .where('batch.year = :year', { year })
      .getCount();
  }

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

  public async findAttendanceData(
    date?: string,
    department?: string,
    batch?: string,
    currentsem?: string,
  ): Promise<AttendanceEntity[]> {
    console.log(date);
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        {message: 'Invalid date format. Date must be in yyyy-MM-dd format.'},
      );
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
