import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';
import { StudentInfRepository } from './student-inf.repositiry';
import { StudentEntity } from '../student/entity/student.entity';

@Injectable()
export class StudentInfService {
  constructor(private studentInfRepository: StudentInfRepository) {}

  /**
   * Retrieves a list of students based on the provided username.
   * @param username - The username of the student to search for.
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   * @throws NotFoundException if no students are found with the provided username.
   */
  public async getStudent(
    username: CreateStudentInfDto,
  ): Promise<StudentEntity[]> {
    const studentEntity: StudentEntity[] =
      await this.studentInfRepository.getStudent(username);
    if (studentEntity.length === 0) {
      throw new NotFoundException({ message: `Please enter a valid username` });
    }
    return studentEntity;
  }
}
