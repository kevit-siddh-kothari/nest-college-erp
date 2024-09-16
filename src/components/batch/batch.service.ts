import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchRepository } from './batch.repository';
import { BatchEntity } from './entity/batch.year.entity';

@Injectable()
export class BatchService {
  constructor(private batchRepository: BatchRepository) {}

  /**
   * Creates a new batch.
   *
   * @param createBatchDto - The details of the batch to create.
   * @returns A promise that resolves to the created `BatchEntity`.
   * @throws InternalServerErrorException if there is an error during creation.
   */
  public async create(createBatchDto: CreateBatchDto): Promise<BatchEntity> {
    try {
      return await this.batchRepository.createBatch(createBatchDto);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves all batches.
   *
   * @returns A promise that resolves to an array of `BatchEntity`.
   * @throws InternalServerErrorException if there is an error during retrieval.
   */
  public async findAll(): Promise<BatchEntity[]> {
    try {
      return await this.batchRepository.getAllBatchs();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves a batch by its ID.
   *
   * @param id - The ID of the batch to retrieve.
   * @returns A promise that resolves to the `BatchEntity`.
   * @throws InternalServerErrorException if there is an error during retrieval.
   */
  public async findOne(id: string): Promise<BatchEntity> {
    try {
      return await this.batchRepository.getBatchById(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Updates a batch by its ID.
   *
   * @param id - The ID of the batch to update.
   * @param updateBatchDto - The updated batch details.
   * @returns A promise that resolves to an array containing the updated `BatchEntity`.
   * @throws InternalServerErrorException if there is an error during update.
   */
  public async update(
    id: string,
    updateBatchDto: UpdateBatchDto,
  ): Promise<BatchEntity[]> {
    try {
      return await this.batchRepository.updateBatch(updateBatchDto, id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes a batch by its ID.
   *
   * @param id - The ID of the batch to delete.
   * @returns A promise that resolves to an array of remaining `BatchEntity`.
   * @throws InternalServerErrorException if there is an error during deletion.
   */
  public async remove(id: string): Promise<BatchEntity[]> {
    try {
      return await this.batchRepository.deleteBatch(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes all batches.
   *
   * @returns A promise that resolves to an object containing a message indicating success.
   * @throws InternalServerErrorException if there is an error during deletion.
   */
  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.batchRepository.deleteAllBatch();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
