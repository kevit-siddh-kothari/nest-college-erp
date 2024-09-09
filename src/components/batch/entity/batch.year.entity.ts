import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { StudentEntity } from '../../student/entity/student.entity';
import { BatchDetailsEntity } from './batch.details.entity';
import { IsNumber } from 'class-validator';

@Entity('batch')
export class BatchEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;  // Primary key

  @IsNumber()
  @Column({unique: true})
  year: number;

  @OneToMany(() => StudentEntity, (student) => student.batch)
  students: StudentEntity[];  // Inverse relationship (One batch has many students)

  @OneToMany(() => BatchDetailsEntity , (batchdetails) => batchdetails.batch)
  yearId: BatchDetailsEntity[];  // Inverse relationship (One batchyear has many batchdetails)

}

