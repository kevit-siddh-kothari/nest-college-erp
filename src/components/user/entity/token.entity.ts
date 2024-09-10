import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity'; // Adjust the path as needed
import { IsString } from 'class-validator';

@Entity('Token')
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsString()
    @Column()
    token: string;

    @ManyToOne(() => UserEntity, user => user.tokens, { onDelete: 'CASCADE' })
    @JoinColumn({name:'userId'})
    user: UserEntity;
}
