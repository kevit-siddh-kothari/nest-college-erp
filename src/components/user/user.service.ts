import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.validation';
import {Response} from 'express';
import { UserRepository } from './user.repository';
import {compareSync} from 'bcrypt'
import { UserEntity } from './entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { TokenEntity } from './entity/token.entity';
import { UpdateUserDto } from './dto/update-user.dto';


interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}


@Injectable()
export class UserService {

  private logger = new Logger(UserService.name); 

  constructor(private userRepo: UserRepository){}

  public async signUp(user: CreateUserDto):Promise<{message?:string; error?:string}> {
    try {
      await this.userRepo.addUser(user);
      this.logger.log(`User created successfully`);
      return { message: 'User created successfully' }
    } catch (error: any) {
      this.logger.error(`Error during sign-up: ${error.message}`);
      return { error: error.message };
    }

  }

  public async logIn(user:UpdateUserDto): Promise<{user?:UpdateUserDto; token?: string; error?:string}> {
    try{
      const entity:UserEntity = await this.userRepo.findByUsername(user.username);
      if (!entity) {
        this.logger.error(`User not found`);
        return { error: 'user not found' };
      }
      const match: boolean = compareSync(user.password, entity.password);
      if (match) {
        const token: string = jwt.sign({ id: entity.id }, 'siddhkothari');
        await this.userRepo.addUserToken(entity.id, token);
        return ({ user, token });
      } else {
        return ({error:'Password is incorrect'});
      }
    }catch(error: any){
      this.logger.error(`Error during log-in: ${error.message}`);
      return { error: error.message };
    }
  }

  public async logOut(req:AuthenticatedRequest, res: Response):Promise<String> {
    try {
      if (!req.user || !req.token) {
        return 'User or token not found';
      }    
      if (req.user && req.token) {
        await this.userRepo.deleteToken(req.token, req.user);
        return 'Logged out successfully';
      } else {
        return 'user token not found';
      }
    } catch (error: any) {
      return `Error during log-out: ${error.message}`;
    }
  }

  public async logOutAll(req: AuthenticatedRequest, res: Response):Promise<string> {
    try {
      if (req.user) {
        await this.userRepo.deleteAllToken(req.user);
        return ('Logged out from all devices successfully');
      } else {
        return 'user not found';
      }
    } catch (error: any) {
      return (`Error during log-out from all devices: ${error.message}`);
    }
  }

}
