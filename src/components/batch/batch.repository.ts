import { InjectRepository } from '@nestjs/typeorm';
import { BatchEntity } from './entity/batch.year.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BatchRepository {
  constructor(
    @InjectRepository(BatchEntity) private batchRep: Repository<BatchEntity>,
  ) {}

  /**
   * Retrieves all batches.
   *
   * @returns A promise that resolves to an array of `BatchEntity`.
   */
  public async getAllBatchs(): Promise<BatchEntity[]> {
    return await this.batchRep.find();
  }

  /**
   * Retrieves a batch by its ID.
   *
   * @param id - The ID of the batch to retrieve.
   * @returns A promise that resolves to the `BatchEntity`.
   * @throws NotFoundException if no batch with the given ID is found.
   */
  public async getBatchById(id: string): Promise<BatchEntity> {
    const batchEntity = await this.batchRep.findOne({ where: { id: id } });
    if (!batchEntity) {
      throw new NotFoundException({ message: `Please enter a valid batch ID` });
    }
    return batchEntity;
  }

  /**
   * Creates a new batch.
   *
   * @param batch - The details of the batch to create.
   * @returns A promise that resolves to the created `BatchEntity`.
   */
  public async createBatch(batch): Promise<BatchEntity> {
    const batchEntity = await this.batchRep.create({
      year: batch.year,
    });
    return await this.batchRep.save(batchEntity);
  }

  /**
   * Updates a batch by its ID.
   *
   * @param batch - The updated batch details.
   * @param id - The ID of the batch to update.
   * @returns A promise that resolves to an array containing the updated `BatchEntity`.
   */
  public async updateBatch(batch, id: string): Promise<BatchEntity[]> {
    const batchEntity = await this.getBatchById(id);
    if (!batchEntity) {
      throw new NotFoundException({ message: `no Batch exists on id ${id}` });
    }
    await this.batchRep.save({
      id: id,
      year: batch.year,
    });
    return this.batchRep.find({ where: { id: id } });
  }

  /**
   * Deletes a batch by its ID.
   *
   * @param id - The ID of the batch to delete.
   * @returns A promise that resolves to an array of remaining `BatchEntity`.
   */
  public async deleteBatch(id: string): Promise<BatchEntity[]> {
    const batchEntity = await this.getBatchById(id);
    if (!batchEntity) {
      throw new NotFoundException({ message: `no Batch exists on id ${id}` });
    }
    await this.batchRep.delete({ id: id });
    return this.getAllBatchs();
  }

  /**
   * Deletes all batches.
   *
   * @returns A promise that resolves to an object containing a message indicating success.
   */
  public async deleteAllBatch(): Promise<{ message: string }> {
    await this.batchRep
      .createQueryBuilder()
      .delete()
      .from(BatchEntity)
      .execute();
    return { message: 'Batch deleted successfully' };
  }
}
