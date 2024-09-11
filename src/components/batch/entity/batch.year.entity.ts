import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentEntity } from '../../student/entity/student.entity';
import { BatchDetailsEntity } from './batch.details.entity';
import { IsNumber, IsString } from 'class-validator';

@Entity('batch')
export class BatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Primary key

  @IsString()
  @Column({ unique: true })
  year: string;

  @OneToMany(() => StudentEntity, (student) => student.batch)
  students: StudentEntity[]; // Inverse relationship (One batch has many students)

  @OneToMany(() => BatchDetailsEntity, (batchdetails) => batchdetails.batch)
  yearId: BatchDetailsEntity[]; // Inverse relationship (One batchyear has many batchdetails)

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
