import { InjectRepository } from "@nestjs/typeorm";
import { BatchEntity } from "./entity/batch.year.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BatchRepository {
    constructor(@InjectRepository(BatchEntity) private batchRep: Repository<BatchEntity>){}

    public async getAllBatchs():Promise<BatchEntity[]> {
        return await this.batchRep.find();
    };

    public async getBatchById(id:string):Promise<BatchEntity>{
        return await this.batchRep.findOne({where:{id:id}});
    };

    public async createBatch(batch):Promise<BatchEntity> {
        const batchEntity = await this.batchRep.create({
            year: batch.year,
        });
        return await this.batchRep.save(batchEntity);
    };

    public async updateBatch(batch,id:string):Promise<BatchEntity[]>{
        await this.batchRep.save({
            id: id,
            year: batch.year
        });
        return this.batchRep.find({where:{id: id}});
    };

    public async deleteBatch(id:string):Promise<BatchEntity[]>{
        await this.batchRep.delete({id:id});
        return this.getAllBatchs();
    };

    public async deleteAllBatch():Promise<{message:string}>{
        await this.batchRep.createQueryBuilder().delete().from(BatchEntity).execute();
        return {message: 'Batch deleted sucessfully'}
    };
}