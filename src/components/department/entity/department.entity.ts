import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentEntity } from '../../student/entity/student.entity';
import { BatchDetailsEntity } from '../../batch/entity/batch.details.entity';

@Entity('department')
export class DepartmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Primary key

  @Column({ unique: true })
  name: string;

  @OneToMany(() => StudentEntity, (student) => student.department)
  students: StudentEntity[]; // Inverse relationship (One department has many students)

  @OneToMany(
    () => BatchDetailsEntity,
    (batchdetails) => batchdetails.department,
  )
  batchDetails: BatchDetailsEntity[];

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
