import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';
import { DepartmentEntity } from './entity/department.entity';

@Injectable()
export class DepartmentService {

  constructor(private departmentRepository:DepartmentRepository){}

  public async create(department: CreateDepartmentDto):Promise<DepartmentEntity> {
    return await this.departmentRepository.createDepartment(department);
  };

  public async findAll():Promise<DepartmentEntity[]> {
    return await this.departmentRepository.getAllDepartments();
  };

  public async findOne(id: string):Promise<DepartmentEntity> {
    return await this.departmentRepository.getDepartmentById(id);
  };

  public async update(id: string, department: UpdateDepartmentDto):Promise<DepartmentEntity[]> {
    return await this.departmentRepository.updateDepartment(department, id);
  };

  public async remove(id: string):Promise<DepartmentEntity[]>{
    return await this.departmentRepository.deleteDepartment(id);
  };

  public async removeAllDeparment():Promise<{message:string}>{
    return await this.departmentRepository.deleteAllDepartment();
  };
};
