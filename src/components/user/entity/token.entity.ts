import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity'; // Adjust the path as needed
import { IsString } from 'class-validator';

@Entity('Token')
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    token: string;

    @ManyToOne(() => UserEntity, user => user.tokens)
    @JoinTable({name:'userId'})
    user: UserEntity;
}
