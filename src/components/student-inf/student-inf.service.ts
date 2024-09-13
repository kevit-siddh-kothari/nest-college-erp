import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';
import { UpdateStudentInfDto } from './dto/update-student-inf.dto';
import { StudentInfRepository } from './student-inf.repositiry';
import { StudentEntity } from '../student/entity/student.entity';


@Injectable()
export class StudentInfService { 
  constructor(private studentInfRepository: StudentInfRepository){}
 public async getStudent(username: string):Promise<StudentEntity[]> {
    const studentEntity: StudentEntity[] =  await this.studentInfRepository.getStudent(username);
    if(studentEntity.length === 0){
      throw new NotFoundException({message:`Please enter valid username`});
    }
    return studentEntity;
  }

}
