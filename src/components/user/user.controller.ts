import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.validation';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';
import { TokenEntity } from './entity/token.entity';
import { Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: TokenEntity;
  token?: string;
}

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint for user sign-up.
   * @param createUserDto - The data transfer object containing user details for registration.
   * @returns A promise that resolves to an object containing user details and/or a token, or an error message.
   */
  @Post('/signup')
  public async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user?: UpdateUserDto; token?: string; error?: string }> {
    return await this.userService.signUp(createUserDto);
  }

  /**
   * Endpoint for user login.
   * @param user - The data transfer object containing user credentials (username and password).
   * @returns A promise that resolves to an object containing user details and a token, or an error message.
   */
  @Post('/login')
  async logIn(
    @Body() user: UpdateUserDto,
  ): Promise<{ user?: UpdateUserDto; token?: string; error?: string }> {
    return this.userService.logIn(user);
  }

  /**
   * Endpoint for user logout.
   * @param req - The request object containing the authenticated user and token.
   * @param res - The response object used to send a response to the client.
   * @returns A promise that resolves when the user has been logged out, and sends a success message to the client.
   */
  @Post('/logout')
  public async logOut(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    await this.userService.logOut(req, res);
    res.send(`logged out successfully!`);
  }

  /**
   * Endpoint for logging out from all devices.
   * @param req - The request object containing the authenticated user and token.
   * @param res - The response object used to send a response to the client.
   * @returns A promise that resolves when the user has been logged out from all devices, and sends a success message to the client.
   */
  @Post('/logoutAll')
  public async logoutAll(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    console.log(req.user);
    await this.userService.logOutAll(req, res);
    res.send(`logged out from all devices!`);
  }
}
