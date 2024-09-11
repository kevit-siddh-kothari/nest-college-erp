import { Injectable } from '@nestjs/common';
import { CreateBatchDetailsDto } from './dto/create-batch-detail.dto';
import { UpdateBatchDetailDto } from './dto/update-batch-detail.dto';
import { BatchDetailsRepository } from './batch-details.repository';
import { BatchDetailsEntity } from '../entity/batch.details.entity';

@Injectable()
export class BatchDetailsService {
  constructor(private batchDetailsRepository: BatchDetailsRepository){}
  public async create(createBatchDetailDto: CreateBatchDetailsDto):Promise<BatchDetailsEntity> {
    const departmentEntity = await this.batchDetailsRepository.getDepartmentById(createBatchDetailDto.departmentid);
    const batchEntity = await this.batchDetailsRepository.getBatchEntityById(createBatchDetailDto.yearid);
    return await this.batchDetailsRepository.createBatch(createBatchDetailDto, departmentEntity, batchEntity);
  };

  public async findAll():Promise<BatchDetailsEntity[]> {
    return await this.batchDetailsRepository.getAllBatchs();
  }

  public async findOne(id: string):Promise<BatchDetailsEntity> {
    return await this.batchDetailsRepository.getBatchById(id);
  }

  public async update(id: string, updateBatchDetailDto: UpdateBatchDetailDto):Promise<BatchDetailsEntity[]> {
    return await this.batchDetailsRepository.updateBatch(updateBatchDetailDto, id);
  }

  public async remove(id: string):Promise<BatchDetailsEntity[]> {
    return await this.batchDetailsRepository.deleteBatch(id);
  }

  public async removeAll():Promise<{message:string}>{
    return await this.batchDetailsRepository.deleteAllBatch();
  }
}
