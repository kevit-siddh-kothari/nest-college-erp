import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { StudentEntity } from './entity/student.entity';
import { DepartmentEntity } from '../department/entity/department.entity';
import { BatchDetailsEntity } from '../batch/entity/batch.details.entity';

@Injectable()
export class StudentService {

  constructor(private studentRepository: StudentRepository ){}

  public async create(createStudentDto: CreateStudentDto):Promise<StudentEntity> {
    const departmentEntity = await this.studentRepository.getDepartmentById(createStudentDto.department);
    const batchEntity = await this.studentRepository.getBatchEntityById(createStudentDto.batchID);
    return this.studentRepository.createStudent(createStudentDto, batchEntity, departmentEntity);
  };

  public async findAll():Promise<StudentEntity[]> {
    return await this.studentRepository.getAllStudents();
  };

  public async findOne(id: string):Promise<StudentEntity> {
    return await this.studentRepository.getStudentById(id)
  };

  public async update(id: string, updateStudentDto: UpdateStudentDto):Promise<StudentEntity[]> {
    return await this.studentRepository.updateStudent(updateStudentDto,id);
  };

  public async remove(id: string):Promise<StudentEntity[]> {
    return await this.studentRepository.deleteStudent(id);
  };

  public async removeAll():Promise<{message:string}>{
    return await this.studentRepository.deleteAllStudent();
  };

  public async getAnalyticsData(){
    return await this.studentRepository.getAnalyticsData();
  }

  public async getVacantSeats(queryObject){
    try {
      const departmentId = queryObject.department ? await this.studentRepository.getDepartmentById(queryObject.department) : null;
      const arr: any[] = [];

      const batchData = await this.studentRepository.findBatchData(queryObject.batch, departmentId ? departmentId.id : undefined);
      if (!batchData.length) {
        throw new Error(`No output for specified year ${queryObject.batch}`);
      }

      for (const batch of batchData) {
        const batchObj: any = {
          year: batch.year,
          totalStudents: await this.studentRepository.countStudentsByBatch(batch.year),
          totalStudentsIntake: 0,
          availableIntake: 0,
          branches: batch.yearId.map((detail: BatchDetailsEntity) => ({
            branch: detail.department.name,
            totalStudentsIntake: parseInt(detail.totalStudentsIntake, 10),
            availableSeats: parseInt(detail.availableSeats, 10),
            occupiedSeats: parseInt(detail.occupiedSeats, 10)
          })),
        };

        batchObj.totalStudentsIntake = batchObj.branches.reduce((acc, branch) => acc + branch.totalStudentsIntake, 0);
        batchObj.availableIntake = batchObj.branches.reduce((acc, branch) => acc + branch.availableSeats, 0);
      
        arr.push(batchObj);
      }

      return arr;
    } catch (error) {
      throw new Error(`Error fetching analytics: ${error.message}`);
    }
  }
}

