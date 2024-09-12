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
          message: `no department exists with ${createBatchDetailDto.departmentid}`,
        });
      }
      const batchEntity = await this.batchDetailsRepository.getBatchEntityById(
        createBatchDetailDto.yearid,
      );
      if (!batchEntity) {
        throw new NotFoundException({
          message: `no batch exists with ${createBatchDetailDto.yearid}`,
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

  public async findAll(): Promise<BatchDetailsEntity[]> {
    try {
      return await this.batchDetailsRepository.getAllBatchs();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

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

  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.batchDetailsRepository.deleteAllBatch();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
