import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceEntity } from './entity/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private attendanceRepository: AttendanceRepository) {}

  /**
   * Creates a new attendance record.
   *
   * @param createAttendanceDto - DTO containing details to create attendance.
   * @returns A promise that resolves to the created `AttendanceEntity`.
   * @throws `NotFoundException` if the student ID does not exist.
   * @throws `InternalServerErrorException` for other unexpected errors.
   */
  public async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceEntity> {
    try {
      const studentEntity = await this.attendanceRepository.getStudentById(
        createAttendanceDto.student,
      );
      if (!studentEntity) {
        throw new NotFoundException({
          message: `No student with ID ${createAttendanceDto.student} exists`,
        });
      }
      return await this.attendanceRepository.createAttendance(
        createAttendanceDto,
        studentEntity,
      );
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves all attendance records.
   *
   * @returns A promise that resolves to an array of `AttendanceEntity`.
   * @throws `InternalServerErrorException` if any unexpected error occurs.
   */
  public async findAll(): Promise<AttendanceEntity[]> {
    try {
      return await this.attendanceRepository.getAllAttendances();
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Retrieves a specific attendance record by its ID.
   *
   * @param id - The ID of the attendance record to retrieve.
   * @returns A promise that resolves to the `AttendanceEntity` with the specified ID.
   * @throws `NotFoundException` if the attendance ID does not exist.
   * @throws `InternalServerErrorException` for other unexpected errors.
   */
  public async findOne(id: string): Promise<AttendanceEntity> {
    try {
      return await this.attendanceRepository.getAttendanceById(id);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Updates an existing attendance record.
   *
   * @param id - The ID of the attendance record to update.
   * @param updateAttendanceDto - DTO containing updated attendance details.
   * @returns A promise that resolves to an array of updated `AttendanceEntity`.
   * @throws `InternalServerErrorException` if any unexpected error occurs.
   */
  public async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity[]> {
    try {
      return await this.attendanceRepository.updateAttendance(
        updateAttendanceDto,
        id,
      );
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }

  /**
   * Deletes an attendance record by its ID.
   *
   * @param id - The ID of the attendance record to delete.
   * @returns A promise that resolves to an array of remaining `AttendanceEntity`.
   * @throws `InternalServerErrorException` if any unexpected error occurs.
   */
  public async remove(id: string): Promise<AttendanceEntity[]> {
    try {
      return await this.attendanceRepository.deleteAttendance(id);
    } catch (error: any) {
      throw new InternalServerErrorException({ message: error.message });
    }
  }
}
