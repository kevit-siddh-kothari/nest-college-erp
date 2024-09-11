import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DepartmentEntity } from '../../department/entity/department.entity';
import { BatchEntity } from '../../batch/entity/batch.year.entity';
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';

@Entity('student')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  readonly username: string;

  @Column()
  name: string;

  @Column()
  phno: string;

  @Column()
  currentSem: string;

  // Many students belong to one department
  @ManyToOne(() => DepartmentEntity, (department) => department.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' }) // Foreign key column in the student table
  department: DepartmentEntity;

  // Many students belong to one batch
  @ManyToOne(() => BatchEntity, (batch) => batch.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batchId' }) // Foreign key column in the student table
  batch: BatchEntity;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.student)
  attendance: AttendanceEntity[];

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
