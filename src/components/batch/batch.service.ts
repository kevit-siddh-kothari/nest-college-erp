import {
  Catch,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchRepository } from './batch.repository';
import { BatchEntity } from './entity/batch.year.entity';

@Injectable()
export class BatchService {
  constructor(private batchRepository: BatchRepository) {}
  public async create(createBatchDto: CreateBatchDto): Promise<BatchEntity> {
    try {
      return await this.batchRepository.createBatch(createBatchDto);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findAll(): Promise<BatchEntity[]> {
    try {
      return await this.batchRepository.getAllBatchs();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async findOne(id: string): Promise<BatchEntity> {
    try {
      return await this.batchRepository.getBatchById(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

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

  public async remove(id: string): Promise<BatchEntity[]> {
    try {
      return await this.batchRepository.deleteBatch(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  public async removeAll(): Promise<{ message: string }> {
    try {
      return await this.batchRepository.deleteAllBatch();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
