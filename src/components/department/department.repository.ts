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

  /**
   * Retrieves all departments.
   *
   * @returns A promise that resolves to an array of `DepartmentEntity`.
   */
  public async getAllDepartments(): Promise<DepartmentEntity[]> {
    return await this.departmentRep.find();
  }

  /**
   * Retrieves a department by its ID.
   *
   * @param id - The ID of the department to retrieve.
   * @returns A promise that resolves to the `DepartmentEntity`.
   * @throws {NotFoundException} If no department is found with the given ID.
   */
  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    const departmentEntity = await this.departmentRep.findOne({
      where: { id: id },
    });
    if (!departmentEntity) {
      throw new NotFoundException({
        message: `Department with ID ${id} does not exist`,
      });
    }
    return departmentEntity;
  }

  /**
   * Creates a new department.
   *
   * @param department - The department details to create.
   * @returns A promise that resolves to the created `DepartmentEntity`.
   */
  public async createDepartment(department): Promise<DepartmentEntity> {
    const departmentEntity = this.departmentRep.create({
      name: department.name,
    });
    return await this.departmentRep.save(departmentEntity);
  }

  /**
   * Updates a department by its ID.
   *
   * @param department - The updated department details.
   * @param id - The ID of the department to update.
   * @returns A promise that resolves to an array containing the updated `DepartmentEntity`.
   */
  public async updateDepartment(
    department,
    id: string,
  ): Promise<DepartmentEntity[]> {
    const departmentEntity = await this.getDepartmentById(id);
    if (!departmentEntity) {
      throw new NotFoundException({
        message: `no department exists on this id ${id}`,
      });
    }
    await this.departmentRep.save({
      id: id,
      name: department.name,
    });
    return this.departmentRep.find({ where: { id: id } });
  }

  /**
   * Deletes a department by its ID.
   *
   * @param id - The ID of the department to delete.
   * @returns A promise that resolves to an array of remaining `DepartmentEntity`.
   * @throws {NotFoundException} If no department is found with the given ID.
   */
  public async deleteDepartment(id: string): Promise<DepartmentEntity[]> {
    const deleteResult = await this.departmentRep.delete({ id: id });
    if (!deleteResult.affected) {
      throw new NotFoundException({
        message: `Department with ID ${id} does not exist`,
      });
    }
    return this.getAllDepartments();
  }

  /**
   * Deletes all departments.
   *
   * @returns A promise that resolves to a message indicating success.
   */
  public async deleteAllDepartment(): Promise<{ message: string }> {
    await this.departmentRep
      .createQueryBuilder()
      .delete()
      .from(DepartmentEntity)
      .execute();
    return { message: 'Departments deleted successfully' };
  }
}
