import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBatchDetailsDto } from './dto/create-batch-detail.dto';
import { UpdateBatchDetailDto } from './dto/update-batch-detail.dto';
import { BatchDetailsRepository } from './batch-details.repository';
import { BatchDetailsEntity } from '../entity/batch.details.entity';

@Injectable()
export class BatchDetailsService {
  constructor(private batchDetailsRepository: BatchDetailsRepository) {}

  /**
   * Creates a new batch detail entity.
   *
   * @param createBatchDetailDto - Data for creating the batch detail.
   * @returns A promise that resolves to the created `BatchDetailsEntity`.
   * @throws {NotFoundException} If the department or batch doesn't exist.
   * @throws {InternalServerErrorException} For any other errors during creation.
   */
  public async create(
    createBatchDetailDto: CreateBatchDetailsDto,
  ): Promise<BatchDetailsEntity> {
    try {
      const departmentEntity =
        await this.batchDetailsRepository.getDepartmentById(
          createBatchDetailDto.departmentid,
        );
      if (!departmentEntity) {
        throw new NotFoundException({
          message: `No department exists with ID ${createBatchDetailDto.departmentid}`,
        });
      }
      const batchEntity = await this.batchDetailsRepository.getBatchEntityById(
        createBatchDetailDto.yearid,
      );
      if (!batchEntity) {
        throw new NotFoundException({
          message: `No batch exists with ID ${createBatchDetailDto.yearid}`,
        });
      }
      return await this.batchDetailsRepository.createBatch(
        createBatchDetailDto,
        departmentEntity,
        batchEntity,
      );
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves all batch details.
   *
   * @returns A promise that resolves to an array of `BatchDetailsEntity`.
   * @throws {InternalServerErrorException} For any errors during retrieval.
   */
  public async findAll(): Promise<BatchDetailsEntity[]> {
    try {
      return await this.batchDetailsRepository.getAllBatchs();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves a specific batch detail by its ID.
   *
   * @param id - The ID of the batch detail to retrieve.
   * @returns A promise that resolves to the `BatchDetailsEntity`.
   * @throws {NotFoundException} If the batch detail doesn't exist.
   * @throws {InternalServerErrorException} For any other errors during retrieval.
   */
  public async findOne(id: string): Promise<BatchDetailsEntity> {
    try {
      return await this.batchDetailsRepository.getBatchById(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Updates a batch detail by its ID.
   *
   * @param id - The ID of the batch detail to update.
   * @param updateBatchDetailDto - Data for updating the batch detail.
   * @returns A promise that resolves to an array containing the updated `BatchDetailsEntity`.
   * @throws {InternalServerErrorException} For any errors during updating.
   */
  public async update(
    id: string,
    updateBatchDetailDto: UpdateBatchDetailDto,
  ): Promise<BatchDetailsEntity[]> {
    try {
      return await this.batchDetailsRepository.updateBatch(
        updateBatchDetailDto,
        id,
      );
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes a batch detail by its ID.
   *
   * @param id - The ID of the batch detail to delete.
   * @returns A promise that resolves to an array of remaining `BatchDetailsEntity`.
   * @throws {NotFoundException} If the batch detail doesn't exist.
   * @throws {InternalServerErrorException} For any other errors during deletion.
   */
  public async remove(id: string): Promise<BatchDetailsEntity[]> {
    try {
      return await this.batchDetailsRepository.deleteBatch(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes all batch details.
   *
   * @returns A promise that resolves to an object containing a success message.
   * @throws {InternalServerErrorException} For any errors during deletion.
   */
  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.batchDetailsRepository.deleteAllBatch();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
