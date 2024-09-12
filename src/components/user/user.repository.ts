import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import { DeleteResult, Repository } from 'typeorm';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';

@Injectable()
@UseFilters(HttpException)
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRep: Repository<UserEntity>,
    @InjectRepository(TokenEntity) private tokenRepo: Repository<TokenEntity>,
  ) {}

  public async addUser(user): Promise<UserEntity> {
    // hashing the password
    const data: UserEntity = this.userRep.create({
      username: user.username,
      password: hashSync(user.password, 10),
      role: user.role,
    });
    return await this.userRep.save(data);
  }

  public async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRep.findOne({ where: { username: username } });
    if(!user){
      throw new NotFoundException('User not found');
    }
    return user
  }

  public async addUserToken(
    userId: string,
    tokenValue: string,
  ): Promise<TokenEntity> {
    const userEntity = await this.userRep.findOne({ where: { id: userId } });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const tokenEntity = await this.tokenRepo.create({
      token: tokenValue,
      user: userEntity,
    });

    return await this.tokenRepo.save(tokenEntity);
  }

  public async isAuthenticated(
    id: string,
    tokenValue: string,
  ): Promise<TokenEntity> {
    const tokenEntity = await this.tokenRepo
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.user', 'user')
      .where('user.id = :userId', { userId: id })
      .andWhere('token.token = :tokenValue', { tokenValue })
      .getOne();
    return tokenEntity;
  }

  public async deleteToken(
    tokenValue: string,
    user: TokenEntity,
  ): Promise<DeleteResult> {
    try {
      const deleted = await this.tokenRepo
        .createQueryBuilder()
        .delete()
        .from(TokenEntity)
        .where('token = :tokenValue', { tokenValue })
        .execute();

      return deleted;
    } catch (error: any) {
      throw new InternalServerErrorException({message: error.message})
    }
  }

  public async deleteAllToken(userRepo: TokenEntity): Promise<void> {
    console.log(userRepo);
    try {
      const userId = userRepo.user.id;
      const deleteResult = await this.tokenRepo.delete({
        user: { id: userId },
      });
    } catch (error: any) {
      throw new InternalServerErrorException({message: error.message})
    }
  }
}
