import { IsNotEmpty, IsString, IsUUID, IsEmail } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @IsEmail()
  username: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  phno: string;

  @IsNotEmpty({ message: 'Current semester is required' })
  @IsString({ message: 'Current semester must be a string' })
  currentsem: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsUUID('all', { message: 'Department ID must be a valid UUID' })
  department: string;

  @IsNotEmpty({ message: 'Batch ID is required' })
  @IsUUID('all', { message: 'Batch ID must be a valid UUID' })
  batchID: string;
}
