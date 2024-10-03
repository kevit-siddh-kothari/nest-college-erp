import { IsEmail, IsNotEmpty } from 'class-validator';

//studentinfo validator
export class CreateStudentInfDto {
  @IsNotEmpty({ message: `please enter username` })
  @IsEmail({}, { message: `please enter a valid username` })
  username: string;
}
