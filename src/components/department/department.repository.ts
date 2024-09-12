import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentEntity } from './entity/department.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRep: Repository<DepartmentEntity>,
  ) {}

  public async getAllDepartments(): Promise<DepartmentEntity[]> {
    return await this.departmentRep.find();
  }

  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    const DepartmentEntity =  await this.departmentRep.findOne({ where: { id: id } });
    if(!DepartmentEntity){
        throw new NotFoundException({message:`Departmetn with ${id} doesnot exists`});
    }
    return DepartmentEntity;
  }

  public async createDepartment(department): Promise<DepartmentEntity> {
    const departmentEntity = await this.departmentRep.create({
      name: department.name,
    });
    return await this.departmentRep.save(departmentEntity);
  }

  public async updateDepartment(
    department,
    id: string,
  ): Promise<DepartmentEntity[]> {
    await this.departmentRep.save({
      id: id,
      name: department.name,
    });
    return this.departmentRep.find({ where: { id: id } });
  }

  public async deleteDepartment(id: string): Promise<DepartmentEntity[]> {
    const DeleteResult = await this.departmentRep.delete({ id: id });
    if(!DeleteResult){
        throw new NotFoundException({message:`please enter the correct batchid`})
    }
    return this.getAllDepartments();
  }

  public async deleteAllDepartment(): Promise<{ message: string }> {
    await this.departmentRep
      .createQueryBuilder()
      .delete()
      .from(DepartmentEntity)
      .execute();
    return { message: 'department deleted sucessfully' };
  }
}
