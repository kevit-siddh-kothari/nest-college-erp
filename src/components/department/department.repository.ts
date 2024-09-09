import { InjectRepository } from "@nestjs/typeorm";
import { DepartmentEntity } from "./entity/department.entity";
import { Repository } from "typeorm";

export class UserRepository {
    constructor(@InjectRepository(DepartmentEntity) private userRep: Repository<DepartmentEntity>){}
}