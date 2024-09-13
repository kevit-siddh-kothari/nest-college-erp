import { InjectRepository } from '@nestjs/typeorm';
import { BatchEntity } from '../entity/batch.year.entity';
import { BatchDetailsEntity } from '../entity/batch.details.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentEntity } from '../../department/entity/department.entity';

@Injectable()
export class BatchDetailsRepository {
  constructor(
    @InjectRepository(BatchDetailsEntity)
    private batchDetailsRepo: Repository<BatchDetailsEntity>,
    @InjectRepository(DepartmentEntity)
    private departmentRepo: Repository<DepartmentEntity>,
    @InjectRepository(BatchEntity) private batchRepo: Repository<BatchEntity>,
  ) {}

  /**
   * Retrieves all batch details from the database.
   *
   * @returns A promise that resolves to an array of `BatchDetailsEntity`.
   */
  public async getAllBatchs(): Promise<BatchDetailsEntity[]> {
    return await this.batchDetailsRepo.find();
  }

  /**
   * Retrieves batch details by its ID.
   *
   * @param id - The ID of the batch detail to retrieve.
   * @returns A promise that resolves to the `BatchDetailsEntity`.
   * @throws {NotFoundException} If no batch detail is found with the provided ID.
   */
  public async getBatchById(id: string): Promise<BatchDetailsEntity> {
    const batchDetails: BatchDetailsEntity =
      await this.batchDetailsRepo.findOne({ where: { id: id } });
    if (!batchDetails) {
      throw new NotFoundException({ message: `Please enter a valid ID` });
    }
    return batchDetails;
  }

  /**
   * Retrieves a department by its ID.
   *
   * @param id - The ID of the department to retrieve.
   * @returns A promise that resolves to the `DepartmentEntity`.
   */
  public async getDepartmentById(id: string): Promise<DepartmentEntity> {
    return await this.departmentRepo.findOne({ where: { id: id } });
  }

  /**
   * Retrieves a batch entity by its ID.
   *
   * @param id - The ID of the batch entity to retrieve.
   * @returns A promise that resolves to the `BatchEntity`.
   */
  public async getBatchEntityById(id: string): Promise<BatchEntity> {
    return await this.batchRepo.findOne({ where: { id: id } });
  }

  /**
   * Creates a new batch detail in the database.
   *
   * @param batch - The data to create a new batch detail.
   * @param departmentEntity - The department entity associated with the batch.
   * @param batchEntity - The batch entity associated with the batch detail.
   * @returns A promise that resolves to the created `BatchDetailsEntity`.
   */
  public async createBatch(
    batch,
    departmentEntity: DepartmentEntity,
    batchEntity: BatchEntity,
  ): Promise<BatchDetailsEntity> {
    const BatchDetailsEntity = await this.batchDetailsRepo.create({
      occupiedSeats: batch.occupiedSeats,
      availableSeats: batch.availableSeats,
      totalStudentsIntake: batch.totalStudentsIntake,
      batch: batchEntity,
      department: departmentEntity,
    });
    return await this.batchDetailsRepo.save(BatchDetailsEntity);
  }

  /**
   * Updates an existing batch detail in the database.
   *
   * @param batch - The data to update the batch detail.
   * @param id - The ID of the batch detail to update.
   * @returns A promise that resolves to an array containing the updated `BatchDetailsEntity`.
   * @throws {NotFoundException} If the batch detail with the provided ID is not found.
   */
  public async updateBatch(
    batch,
    id: string,
  ): Promise<BatchDetailsEntity[]> {
    const existingBatchDetails: BatchDetailsEntity =
      await this.batchDetailsRepo.findOneBy({ id });
    const updatedBatchDetails: BatchDetailsEntity =
      await this.batchDetailsRepo.merge(existingBatchDetails, batch);
    await this.batchDetailsRepo.save(updatedBatchDetails);
    return this.batchDetailsRepo.find({ where: { id: id } });
  }

  /**
   * Deletes a batch detail by its ID.
   *
   * @param id - The ID of the batch detail to delete.
   * @returns A promise that resolves to an array of remaining `BatchDetailsEntity`.
   */
  public async deleteBatch(id: string): Promise<BatchDetailsEntity[]> {
    await this.batchDetailsRepo.delete({ id: id });
    return this.getAllBatchs();
  }

  /**
   * Deletes all batch details from the database.
   *
   * @returns A promise that resolves to an object containing a success message.
   */
  public async deleteAllBatch(): Promise<{ message: string }> {
    await this.batchDetailsRepo
      .createQueryBuilder()
      .delete()
      .from(BatchDetailsEntity)
      .execute();
    return { message: 'Batch deleted successfully' };
  }
}
