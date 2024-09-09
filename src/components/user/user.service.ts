import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {

  private logger = new Logger(UserService.name); 

  constructor(private userRepo: UserRepository){}

  public async signUp(user: CreateUserDto) {
    const data = await this.userRepo.addUser(user);
    return data;
  }

  findAll() {
    this.logger.error('I am the error')
    this.logger.log('iam the log')
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
