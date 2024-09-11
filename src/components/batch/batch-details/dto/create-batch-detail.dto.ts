import { IsInt, IsPositive, Min, Max, IsUUID, Validate, IsString } from "class-validator";


export class CreateBatchDetailsDto {

    @IsUUID() // Assuming batchId should be UUID too
    yearid: string;

    @IsUUID() // Assuming departmentId should be UUID too
    departmentid: string;

    @IsString()
    occupiedSeats: string;

    @IsString()
    availableSeats: string;

    @IsString()
    totalStudentsIntake: string;

}
