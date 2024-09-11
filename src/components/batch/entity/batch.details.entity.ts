import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BatchEntity } from './batch.year.entity';
import { DepartmentEntity } from 'src/components/department/entity/department.entity';
import { IsNumber, IsString } from 'class-validator';

@Entity('batch-details')
export class BatchDetailsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BatchEntity, (batch) => batch.yearId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: BatchEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.batchDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @IsString()
  @Column()
  occupiedSeats: string;

  @IsString()
  @Column()
  availableSeats: string;

  @IsString()
  @Column()
  totalStudentsIntake: string;

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
