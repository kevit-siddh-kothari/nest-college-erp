import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from './entity/attendance.entity';
import { Repository } from 'typeorm';
import { StudentEntity } from '../student/entity/student.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(AttendanceEntity)
    private attendanceRep: Repository<AttendanceEntity>,
    @InjectRepository(StudentEntity)
    private studentRep: Repository<StudentEntity>,
  ) {}

  /**
   * Retrieves all attendance records.
   *
   * @returns A promise that resolves to an array of `AttendanceEntity`.
   */
  public async getAllAttendances(): Promise<AttendanceEntity[]> {
    return await this.attendanceRep.find();
  }

  /**
   * Retrieves an attendance record by its ID.
   *
   * @param id - The ID of the attendance record to retrieve.
   * @returns A promise that resolves to the `AttendanceEntity` with the specified ID.
   * @throws `NotFoundException` if the attendance ID does not exist.
   */
  public async getAttendanceById(id: string): Promise<AttendanceEntity> {
    const attendance: AttendanceEntity = await this.attendanceRep.findOne({
      where: { id: id },
    });
    if (!attendance) {
      throw new NotFoundException({ message: `Please enter a valid ID` });
    }
    return attendance;
  }

  /**
   * Retrieves a student entity by its ID.
   *
   * @param id - The ID of the student.
   * @returns A promise that resolves to the `StudentEntity` with the specified ID.
   */
  public async getStudentById(id: string) {
    return await this.studentRep.findOne({ where: { id: id } });
  }

  /**
   * Creates a new attendance record.
   *
   * @param attendance - The data used to create the attendance record.
   * @param StudentEntity - The associated student entity.
   * @returns A promise that resolves to the created `AttendanceEntity`.
   */
  public async createAttendance(
    attendance,
    StudentEntity,
  ): Promise<AttendanceEntity> {
    const AttendanceEntity = await this.attendanceRep.create({
      isPresent: attendance.isPresent,
      student: StudentEntity,
    });
    return await this.attendanceRep.save(AttendanceEntity);
  }

  /**
   * Updates an existing attendance record.
   *
   * @param attendance - The data used to update the attendance record.
   * @param id - The ID of the attendance record to update.
   * @returns A promise that resolves to an array of updated `AttendanceEntity`.
   */
  public async updateAttendance(
    attendance,
    id: string,
  ): Promise<AttendanceEntity[]> {
    const existingAttendance: AttendanceEntity =
      await this.attendanceRep.findOne({ where: { id: id } });
    if (!existingAttendance) {
      throw new NotFoundException({
        message: `no attendance exists on id ${id}`,
      });
    }
    const updatedResult: AttendanceEntity = await this.attendanceRep.merge(
      existingAttendance,
      attendance,
    );
    await this.attendanceRep.save(updatedResult);
    return this.attendanceRep.find({ where: { id: id } });
  }

  /**
   * Deletes an attendance record by its ID.
   *
   * @param id - The ID of the attendance record to delete.
   * @returns A promise that resolves to an array of remaining `AttendanceEntity`.
   */
  public async deleteAttendance(id: string): Promise<AttendanceEntity[]> {
    const existingAttendance: AttendanceEntity =
      await this.attendanceRep.findOne({ where: { id: id } });
    if (!existingAttendance) {
      throw new NotFoundException({
        message: `no attendance exists on id ${id}`,
      });
    }
    await this.attendanceRep.delete({ id: id });
    return this.getAllAttendances();
  }

  /**
   * Deletes all attendance records.
   *
   * @returns A promise that resolves to an object containing a success message.
   */
  public async deleteAllAttendance(): Promise<{ message: string }> {
    await this.attendanceRep
      .createQueryBuilder()
      .delete()
      .from(AttendanceEntity)
      .execute();
    return { message: 'Attendance deleted successfully' };
  }
}
