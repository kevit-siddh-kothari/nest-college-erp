import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BatchEntity } from "./batch.year.entity";
import { DepartmentEntity } from "src/components/department/entity/department.entity";
import { IsNumber } from "class-validator";

@Entity('batch-details')
export class BatchDetailsEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=>BatchEntity, (batch) => batch.yearId)
    @JoinColumn({name:'yearid'})
    batch: BatchEntity

    @ManyToOne(()=> DepartmentEntity, (department) => department.batchDetails)
    @JoinColumn({name:'departmentid'})
    department: DepartmentEntity;

    @IsNumber()
    @Column()
    occupiedSeats: number;

    @IsNumber()
    @Column()
    availableSeats: number;

    @IsNumber()
    @Column()
    totalStudentsIntake: number;

}