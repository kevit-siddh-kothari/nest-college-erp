import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepartmentEntity } from '../../department/entity/department.entity';
import { BatchEntity } from '../../batch/entity/batch.year.entity';
import { AttendanceEntity } from 'src/components/attendance/entity/attendance.entity';


@Entity('student')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({unique: true})
  readonly username: string;

  @Column()
  name: string;

  @Column()
  phnoName: string;

  @Column()
  currentSem: string;

  // Many students belong to one department
  @ManyToOne(() => DepartmentEntity, (department) => department.students)
  @JoinColumn({ name: 'departmentId' }) // Foreign key column in the student table
  department: DepartmentEntity;

  // Many students belong to one batch
  @ManyToOne(() => BatchEntity, (batch) => batch.students)
  @JoinColumn({ name: 'batchId' }) // Foreign key column in the student table
  batch: BatchEntity;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.student)
  attendance: AttendanceEntity[];

};
