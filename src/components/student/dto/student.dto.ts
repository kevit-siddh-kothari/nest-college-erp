import { BatchEntity } from "src/components/batch/entity/batch.year.entity";
import { DepartmentEntity } from "src/components/department/entity/department.entity";
import {IsNotEmpty, IsString, IsNumber, IsUUID, IsEmail} from 'class-validator'

export class StudentDto {

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @IsEmail()
    readonly username: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    @IsNumber({},{ message: 'Phone number must be a number' })
    readonly phno: number;

    @IsNotEmpty({ message: 'Current semester is required' })
    @IsNumber({}, { message: 'Current semester must be a number' })
    readonly currentsem: number;

    @IsNotEmpty({ message: 'Department is required' })
    @IsUUID('all', { message: 'Department ID must be a valid UUID' })
    department: string;

    @IsNotEmpty({ message: 'Batch ID is required' })
    @IsUUID('all', { message: 'Batch ID must be a valid UUID' })
    batchID: string; 

}