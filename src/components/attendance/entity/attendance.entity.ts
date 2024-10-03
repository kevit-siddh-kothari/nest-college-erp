import { IsBoolean } from 'class-validator';
import { StudentEntity } from '../../student/entity/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsBoolean()
  @Column()
  isPresent: boolean;

  @ManyToOne(() => StudentEntity, (student) => student.attendance)
  @JoinTable({ name: 'studentid' })
  student: StudentEntity;

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
