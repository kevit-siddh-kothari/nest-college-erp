import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TokenEntity } from './token.entity'; // Adjust the path as needed
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum UserRole {
    Admin = 'admin',
    Student = 'student',
    StaffMember = 'staffMember'
}

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;

    @OneToMany(() => TokenEntity, (token) => token.user)
    tokens: TokenEntity[];
}
