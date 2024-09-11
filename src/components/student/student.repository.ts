import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from './entity/student.entity';
import { Batch, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchEntity } from '../batch/entity/batch.year.entity';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRep: Repository<StudentEntity>,

    @InjectRepository(DepartmentEntity)
    private departmentRepo: Repository<DepartmentEntity>,

    @InjectRepository(BatchEntity)
    private batchRepo: Repository<BatchEntity>,

    @InjectRepository(BatchDetailsEntity)
    private batchDetailsRepo: Repository<BatchDetailsEntity>,
  ) {}

  public async getAllStudents(): Promise<StudentEntity[]> {
    return await this.studentRep.find();
  }

  public async getStudentById(id: string): Promise<StudentEntity> {
    return await this.studentRep.findOne({ where: { id: id } });
  }

  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    return await this.departmentRepo.findOne({ where: { id: id } });
  }

  public async getBatchEntityById(id: string): Promise<BatchEntity> {
    return await this.batchRepo.findOne({ where: { id: id } });
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

  public async getAbsentStudents(queryObject) {}

  public async getStudentWhoseAttendanceisLessThan75() {}

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
}
