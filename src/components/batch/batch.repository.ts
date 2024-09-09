import { InjectRepository } from "@nestjs/typeorm";
import { BatchEntity } from "./entity/batch.year.entity";
import { Repository } from "typeorm";

export class UserRepository {
    constructor(@InjectRepository(BatchEntity) private userRep: Repository<BatchEntity>){}
}