import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('/login')
  logIn() {
    return this.userService.findAll();
  }

  @Post('/logout')
  logOut(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('/logoutAll')
  logoutAll(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

}
