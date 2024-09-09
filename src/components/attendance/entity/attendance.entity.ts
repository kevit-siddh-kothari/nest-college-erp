import { IsBoolean, isBoolean } from "class-validator";
import { StudentEntity } from "src/components/student/entity/student.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attendance')
export class AttendanceEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @IsBoolean()
    @Column()
    isPresent: boolean;

    @ManyToOne(()=> StudentEntity, (student) => student.attendance )
    @JoinTable({name: 'studentid'})
    student: StudentEntity;

};