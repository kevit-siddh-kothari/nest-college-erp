import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceEntity } from "./entity/attendance.entity";
import { Repository } from "typeorm";

export class UserRepository {
    constructor(@InjectRepository(AttendanceEntity) private userRep: Repository<AttendanceEntity>){}
}