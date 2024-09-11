import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceEntity } from "./entity/attendance.entity";
import { Repository } from "typeorm";
import { StudentEntity } from "../student/entity/student.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AttendanceRepository {
    constructor(@InjectRepository(AttendanceEntity) private attendanceRep: Repository<AttendanceEntity>,
    @InjectRepository(StudentEntity) private studentRep: Repository<StudentEntity>){}
        
    public async getAllAttendances():Promise<AttendanceEntity[]> {
        return await this.attendanceRep.find();
    };

    public async getAttendanceById(id:string):Promise<AttendanceEntity>{
        return await this.attendanceRep.findOne({where:{id:id}});
    };

    public async getStudentById(id:string){
        return await this.studentRep.findOne({where:{id:id}});
    };

    public async createAttendance(attendance, StudentEntity):Promise<AttendanceEntity> {
        const AttendanceEntity = await this.attendanceRep.create({
            isPresent: attendance.isPresent,
            student: StudentEntity
        });
        return await this.attendanceRep.save(AttendanceEntity);
    };

    public async updateAttendance(attendance,id:string):Promise<AttendanceEntity[]> {
        const existingAttendance:AttendanceEntity = await this.attendanceRep.findOne({where:{id:id}});
        const updatedResult :AttendanceEntity= await this.attendanceRep.merge(existingAttendance, attendance);
        await this.attendanceRep.save(updatedResult);
        return this.attendanceRep.find({where:{id: id}});
    };

    public async deleteAttendance(id:string):Promise<AttendanceEntity[]> {
        await this.attendanceRep.delete({id:id});
        return this.getAllAttendances();
    };

    public async deleteAllAttendance():Promise<{message:string}>{
        await this.attendanceRep.createQueryBuilder().delete().from(AttendanceEntity).execute();
        return {message: 'Attendance deleted sucessfully'}
    };
};
