import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

enum UserRole{
    Admin = 'admin',
    Student = 'student',
    StaffMember = 'StaffMember'
}


export class CreateUserDto {
    
    @IsNotEmpty({message:`Username must not be Empty`})
    @IsString({message:`Username must not be Empty`})
    @IsEmail()
    readonly username: string;

    @IsNotEmpty({message:`Password must not be Empty`})
    @IsString({message:'Password must be of type string'})
    @MinLength(7,{message: `password must be of minimum length 7`})
    @MaxLength(20, {message:`password must be of maxlength 20`})
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    readonly password: string;

    @IsEnum(UserRole, {message: `please enter valid role either admin, student, staffmember`})
    readonly role: UserRole;
    
}