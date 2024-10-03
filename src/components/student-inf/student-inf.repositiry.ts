import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../student/entity/student.entity';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';

@Injectable()
export class StudentInfRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRep: Repository<StudentEntity>,
  ) {}

  /**
   * Retrieves a list of students based on the provided username.
   * This method queries the database for students whose username matches the provided username.
   * It also joins with the `batch` and `department` tables to include related information.
   *
   * @param username - The username of the student to search for.
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   */
  public async getStudent(
    username: CreateStudentInfDto,
  ): Promise<StudentEntity[]> {
    const studentEntity = await this.studentRep
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.batch', 'batch')
      .leftJoinAndSelect('student.department', 'department')
      .where('student.username = :username', { username: username });

    return studentEntity.getMany();
  }
}
