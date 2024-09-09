import { InjectRepository } from "@nestjs/typeorm";
import { StudentEntity } from "./entity/student.entity";
import { Repository } from "typeorm";

export class UserRepository {
    constructor(@InjectRepository(StudentEntity) private userRep: Repository<StudentEntity>){}
}