import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name) 


  create(createUserDto: CreateUserDto) {
    
    return 'This action adds a new user';
  }

  findAll() {
    this.logger.log('error in the hell');
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
