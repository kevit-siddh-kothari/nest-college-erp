import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StudentEntity } from '../../student/entity/student.entity';
import { BatchDetailsEntity } from 'src/components/batch/entity/batch.details';

@Entity('department')
export class DepartmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;  // Primary key

  @Column({unique: true})
  name: string;

  @OneToMany(() => StudentEntity, (student) => student.department)
  students: StudentEntity[];  // Inverse relationship (One department has many students)

  @OneToMany(() => BatchDetailsEntity, (batchdetails) => batchdetails.department)
  batchdetails: BatchDetailsEntity[];
}
