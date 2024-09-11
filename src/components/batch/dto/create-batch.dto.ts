import { IsUUID, IsNumber, IsNotEmpty, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateBatchDto {

  @IsString({ message: 'Year must be a string' })
  @IsNotEmpty({ message: 'Year is required' })
  readonly year: string;

}
