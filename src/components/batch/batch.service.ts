import { Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchRepository } from './batch.repository';
import { BatchEntity } from './entity/batch.year.entity';

@Injectable()
export class BatchService {
  constructor(private batchRepository: BatchRepository){}
  public async create(createBatchDto: CreateBatchDto):Promise<BatchEntity> {
    return await this.batchRepository.createBatch(createBatchDto);
  };

  public async findAll():Promise<BatchEntity[]> {
    return await this.batchRepository.getAllBatchs()
  };

  public async findOne(id: string):Promise<BatchEntity> {
    return await this.batchRepository.getBatchById(id);
  };

  public async update(id: string, updateBatchDto: UpdateBatchDto):Promise<BatchEntity[]> {
    return await this.batchRepository.updateBatch(updateBatchDto, id);
  };

  public async remove(id: string):Promise<BatchEntity[]> {
    return await this.batchRepository.deleteBatch(id);
  };

  public async removeAll():Promise<{message:string}>{
    return await this.batchRepository.deleteAllBatch();
  };
};
