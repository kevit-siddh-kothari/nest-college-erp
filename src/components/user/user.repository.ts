import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.validation";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(UserEntity) private userRep: Repository<UserEntity>){}

    public async addUser(user:CreateUserDto){
        // return await this.userRep.save(user);
    };

    public async findByUsername(username){
        return await this.userRep.findOneBy(username)
    }

    public async updateUserToken(user: UserEntity, token: any[]){

    }
}