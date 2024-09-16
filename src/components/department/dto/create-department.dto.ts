import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty({ message: `name field is required !` })
  name: string;
}
