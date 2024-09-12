import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceEntity } from './entity/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private attendanceRepository: AttendanceRepository) {}

  public async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceEntity> {
    try{
      const studentEntity = await this.attendanceRepository.getStudentById(
        createAttendanceDto.student,
      );
      if(!studentEntity){
        throw new NotFoundException({message:`no student with ${createAttendanceDto.student} exists`});
      }
      return await this.attendanceRepository.createAttendance(
        createAttendanceDto,
        studentEntity,
      );
    }catch(error: any){
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

  public async findAll(): Promise<AttendanceEntity[]> {
    try{
      return await this.attendanceRepository.getAllAttendances();
    }catch(error: any){
      throw new InternalServerErrorException({message: error.message});
    }
  }

  public async findOne(id: string): Promise<AttendanceEntity> {
    try{
      return await this.attendanceRepository.getAttendanceById(id);
    }catch(error: any){
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({message: error.message});
    }
  }

  public async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity[]> {
    try{
      return await this.attendanceRepository.updateAttendance(
        updateAttendanceDto,
        id,
      );
    }catch(error: any){
      throw new InternalServerErrorException({message: error.message});
    }
  }

  public async remove(id: string): Promise<AttendanceEntity[]> {
    try{
      return await this.attendanceRepository.deleteAttendance(id);
    }catch(error: any){
      throw new InternalServerErrorException({message: error.message});
    }
  }
}
