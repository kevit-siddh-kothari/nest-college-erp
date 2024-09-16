import { IsInt, IsPositive, Min, IsUUID } from 'class-validator';

export class CreateBatchDetailsDto {
  @IsUUID() // Validate the ID as a UUID
  id: string;

  @IsUUID() // Assuming batchId should be UUID too
  yearid: string;

  @IsUUID() // Assuming departmentId should be UUID too
  departmentid: string;

  @IsInt() // Ensure it is an integer
  @IsPositive() // Ensure it is a positive number
  occupiedSeats: number;

  @IsInt() // Ensure it is an integer
  @Min(0) // At least 0 seats available
  availableSeats: number;

  @IsInt() // Ensure it is an integer
  @IsPositive() // Ensure it is a positive number
  totalStudentsIntake: number;
}
