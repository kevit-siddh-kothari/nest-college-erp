import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceEntity } from './entity/attendance.entity';

@Injectable()
export class AttendanceService {

  constructor(private attendanceRepository:AttendanceRepository){}

  public async create(createAttendanceDto: CreateAttendanceDto):Promise<AttendanceEntity>  {
    const studentEntity = await this.attendanceRepository.getStudentById(createAttendanceDto.student);
    return await this.attendanceRepository.createAttendance(createAttendanceDto, studentEntity);
  }

  public async findAll():Promise<AttendanceEntity[]>  {
    return await this.attendanceRepository.getAllAttendances();
  }

  public async findOne(id: string):Promise<AttendanceEntity>  {
    return await this.attendanceRepository.getAttendanceById(id);
  }

  public async update(id: string, updateAttendanceDto: UpdateAttendanceDto):Promise<AttendanceEntity[]>  {
    return await this.attendanceRepository.updateAttendance(updateAttendanceDto,id);
  }

  public async remove(id: string):Promise<AttendanceEntity[]> {
    return await this.attendanceRepository.deleteAttendance(id);
  }


}
