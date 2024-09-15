import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entity/user.entity';
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

  /**
   * Adds a new user to the database with a hashed password.
   * @param user - The user object containing username, password, and role.
   * @returns A promise that resolves to the created UserEntity.
   */
  public async addUser(user: {
    username: string;
    password: string;
    role: UserRole;
  }): Promise<UserEntity> {
    // Hashing the password
    const data: UserEntity = this.userRep.create({
      username: user.username,
      password: hashSync(user.password, 10),
      role: user.role,
    });
    console.log(data);
    return await this.userRep.save(data);
  }

  /**
   * Finds a user by their username.
   * @param username - The username to search for.
   * @returns A promise that resolves to the found UserEntity.
   * @throws {NotFoundException} If no user with the given username is found.
   */
  public async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.userRep.findOne({ where: { username: username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Adds a token for a specific user.
   * @param userId - The ID of the user to associate with the token.
   * @param tokenValue - The token value to be added.
   * @returns A promise that resolves to the created TokenEntity.
   * @throws {NotFoundException} If no user with the given ID is found.
   */
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

  /**
   * Checks if the provided token is valid for a specific user.
   * @param id - The ID of the user to check.
   * @param tokenValue - The token value to validate.
   * @returns A promise that resolves to the TokenEntity if valid, otherwise null.
   */
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

  /**
   * Deletes a specific token from the database.
   * @param tokenValue - The token value to delete.
   * @param user - The TokenEntity object associated with the token.
   * @returns A promise that resolves to the result of the delete operation.
   * @throws {InternalServerErrorException} If there is an error during the delete operation.
   */
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
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes all tokens associated with a specific user.
   * @param userRepo - The TokenEntity object containing the user information.
   * @returns A promise that resolves when all tokens for the user have been deleted.
   * @throws {InternalServerErrorException} If there is an error during the delete operation.
   */
  public async deleteAllToken(userRepo: TokenEntity): Promise<void> {
    try {
      const userId = userRepo.user.id;
      await this.tokenRepo.delete({
        user: { id: userId },
      });
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
