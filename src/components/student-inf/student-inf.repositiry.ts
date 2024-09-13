import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../student/entity/student.entity';

@Injectable()
export class StudentInfRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRep: Repository<StudentEntity>,
  ) {}

  public async getStudent(username: string):Promise<StudentEntity[]> {
    const studentEntity = await this.studentRep
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.batch', 'batch')
      .leftJoinAndSelect('student.department', 'department')
      .where('student.username = :username', { username: username });

    return studentEntity.getMany();
  }
}
