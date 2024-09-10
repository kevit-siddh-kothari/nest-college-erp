import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import { Repository } from 'typeorm';
import { HttpException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { AppDatSource } from '../../datasource/db.configuration';
import { hashSync } from 'bcrypt';
import { error } from 'console';

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
    return await this.userRep.findOne({ where: { username: username } });
  }

  public async addUserToken(
    userId: string,
    tokenValue: string,
  ): Promise<TokenEntity> {
    const userEntity = await this.userRep.findOne({ where: { id: userId } });

    if (!userEntity) {
      throw new Error('User not found');
    }

    const tokenEntity = await this.tokenRepo.create({
      token: tokenValue,
      user: userEntity,
    });

    return await this.tokenRepo.save(tokenEntity);
  }

  public async isAuthenticated(id: string, tokenValue: string) {
    const tokenEntity = await this.tokenRepo
      .createQueryBuilder('token')
      .innerJoinAndSelect('token.user', 'user') // Ensure the join is correct
      .where('user.id = :userId', { userId: id }) // Ensure parameter names are correct
      .andWhere('token.token = :tokenValue', { tokenValue }) // Ensure parameter names are correct
      .getOne();
    return tokenEntity;
  }

  public async deleteToken(tokenValue: string, user) {
    try {
      const deleted = await this.tokenRepo
        .createQueryBuilder()
        .delete()
        .from(TokenEntity)
        .where('token = :tokenValue', { tokenValue })
        .execute();

      return deleted;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  public async deleteAllToken(userRepo) {
    console.log(userRepo);
    try {
        const userId = userRepo.user.id;
        console.log(userId);
        const deleteResult = await this.tokenRepo.delete({ user: {id: userId}});
        console.log(deleteResult);
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
