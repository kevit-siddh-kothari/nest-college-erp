import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentRepository } from './department.repository';
import { DepartmentEntity } from './entity/department.entity';

@Injectable()
export class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  /**
   * Creates a new department.
   *
   * @param department - The DTO containing the department details.
   * @returns A promise that resolves to the created `DepartmentEntity`.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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

  /**
   * Retrieves all departments.
   *
   * @returns A promise that resolves to an array of `DepartmentEntity`.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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

  /**
   * Retrieves a department by its ID.
   *
   * @param id - The ID of the department to retrieve.
   * @returns A promise that resolves to the `DepartmentEntity`.
   * @throws {NotFoundException} If no department is found with the given ID.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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

  /**
   * Updates a department by its ID.
   *
   * @param id - The ID of the department to update.
   * @param department - The DTO containing the updated department details.
   * @returns A promise that resolves to an array containing the updated `DepartmentEntity`.
   * @throws {NotFoundException} If no department is found with the given ID.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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

  /**
   * Deletes a department by its ID.
   *
   * @param id - The ID of the department to delete.
   * @returns A promise that resolves to an array of remaining `DepartmentEntity`.
   * @throws {NotFoundException} If no department is found with the given ID.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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

  /**
   * Deletes all departments.
   *
   * @returns A promise that resolves to a message indicating success.
   * @throws {InternalServerErrorException} If an unexpected error occurs.
   */
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
