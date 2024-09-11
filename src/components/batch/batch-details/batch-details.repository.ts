import { InjectRepository } from "@nestjs/typeorm";
import { BatchEntity } from "../entity/batch.year.entity";
import { BatchDetailsEntity } from "../entity/batch.details.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { DepartmentRepository } from "src/components/department/department.repository";
import { DepartmentEntity } from "src/components/department/entity/department.entity";
import { BatchRepository } from "../batch.repository";

@Injectable()
export class BatchDetailsRepository {
    constructor(@InjectRepository(BatchDetailsEntity) private batchDetailsRepo: Repository<BatchDetailsEntity>,
                @InjectRepository(DepartmentEntity) private departmentRepo: Repository<DepartmentEntity>,
                @InjectRepository(BatchEntity) private batchRepo: Repository<BatchEntity>){}

    public async getAllBatchs():Promise<BatchDetailsEntity[]> {
        return await this.batchDetailsRepo.find();
    };

    public async getBatchById(id:string):Promise<BatchDetailsEntity>{
        return await this.batchDetailsRepo.findOne({where:{id:id}});
    };

    public async getDepartmentById(id: string):Promise<DepartmentEntity>{
        return await this.departmentRepo.findOne({where:{id:id}});
    };

    public async getBatchEntityById(id: string):Promise<BatchEntity>{
        return await this.batchRepo.findOne({where:{id:id}})
    };

    public async createBatch(batch, departmentEntity:DepartmentEntity, batchEntity:BatchEntity):Promise<BatchDetailsEntity> {
        const BatchDetailsEntity = await this.batchDetailsRepo.create({
            occupiedSeats: batch.occupiedSeats,
            availableSeats: batch.availableSeats,
            totalStudentsIntake: batch.totalStudentsIntake,
            batch: batchEntity,
            department: departmentEntity,
        });
        return await this.batchDetailsRepo.save(BatchDetailsEntity);
    };

    public async updateBatch(batch,id:string):Promise<BatchDetailsEntity[]>{
        const existingBatchDetails:BatchDetailsEntity = await this.batchDetailsRepo.findOneBy({ id });
        const updatedBatchDetails:BatchDetailsEntity = await this.batchDetailsRepo.merge(existingBatchDetails, batch);
        await this.batchDetailsRepo.save(updatedBatchDetails);
        return this.batchDetailsRepo.find({where:{id: id}});
    };

    public async deleteBatch(id:string):Promise<BatchDetailsEntity[]>{
        await this.batchDetailsRepo.delete({id:id});
        return this.getAllBatchs();
    };

    public async deleteAllBatch():Promise<{message:string}>{
        await this.batchDetailsRepo.createQueryBuilder().delete().from(BatchDetailsEntity).execute();
        return {message: 'Batch deleted sucessfully'}
    };
}