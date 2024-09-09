import { IsUUID, IsNumber, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CreateBatchDto {

  @IsUUID()
  @IsNotEmpty({ message: 'ID is required' })
  readonly id: string;

  @IsNumber({}, { message: 'Year must be a number' })
  @IsNotEmpty({ message: 'Year is required' })
  readonly year: number;

}
