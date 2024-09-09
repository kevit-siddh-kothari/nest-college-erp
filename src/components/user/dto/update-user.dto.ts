import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.validation';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
