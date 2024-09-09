import { Injectable } from "@nestjs/common";
import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

enum UserRole{
    Admin = 'admin',
    Student = 'student',
    StaffMember = 'StaffMember'
}

@Injectable()
@Entity('User')
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({unique: true})
    readonly username: string;

    @Column()
    readonly password: string;

    @Column()
    readonly role: UserRole;
};