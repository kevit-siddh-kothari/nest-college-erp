import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';
import { DepartmentEntity } from './entity/department.entity';
import { AnyARecord } from 'dns';

@Injectable()
export class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  public async create(
    department: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    try {
      return await this.departmentRepository.createDepartment(department);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findAll(): Promise<DepartmentEntity[]> {
    try {
      return await this.departmentRepository.getAllDepartments();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findOne(id: string): Promise<DepartmentEntity> {
    try {
      return await this.departmentRepository.getDepartmentById(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async update(
    id: string,
    department: UpdateDepartmentDto,
  ): Promise<DepartmentEntity[]> {
    try {
      return await this.departmentRepository.updateDepartment(department, id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async remove(id: string): Promise<DepartmentEntity[]> {
    try {
      return await this.departmentRepository.deleteDepartment(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async removeAllDeparment(): Promise<{ message: string }> {
    try {
      return await this.departmentRepository.deleteAllDepartment();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
