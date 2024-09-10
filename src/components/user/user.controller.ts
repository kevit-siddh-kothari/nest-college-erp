import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Request, Response } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { TokenEntity } from './entity/token.entity';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Controller('user')
// @UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

 

  @Post('/signup')
  public async signUp(@Body() createUserDto: CreateUserDto) {
    console.log('hi');
    return await this.userService.signUp(createUserDto);
  }

  @Post('/login')
  logIn(@Body() user: UpdateUserDto) {
    return this.userService.logIn(user);
  }

  @Post('/logout')
  public async logOut(@Request() req: AuthenticatedRequest, @Response() res) {
    await this.userService.logOut(req, res);
    res.send(`logged out sucessfully !`)
  }

  @Post('/logoutAll')
  public async logoutAll(@Request() req: AuthenticatedRequest, @Response() res) {
    console.log(req.user);
    await this.userService.logOutAll(req, res);
    res.send(`logged out from all devices !`);
  }

}
