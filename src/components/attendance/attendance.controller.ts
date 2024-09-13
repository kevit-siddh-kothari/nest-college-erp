import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceEntity } from './entity/attendance.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';

@Controller('attendance')
@Roles(UserRole.Admin, UserRole.StaffMember)
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Creates a new attendance record.
   *
   * @param createAttendanceDto - The data for creating the attendance record.
   * @returns A promise that resolves to the created `AttendanceEntity`.
   */
  @Post('/add-attendance')
  async create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.create(createAttendanceDto);
  }

  /**
   * Retrieves all attendance records.
   *
   * @returns A promise that resolves to an array of `AttendanceEntity`.
   */
  @Get('/get-all-attendance')
  async findAll(): Promise<AttendanceEntity[]> {
    return this.attendanceService.findAll();
  }

  /**
   * Retrieves a specific attendance record by its ID.
   *
   * @param id - The ID of the attendance record to retrieve.
   * @returns A promise that resolves to the `AttendanceEntity` with the specified ID.
   */
  @Get('/get-attendance/:id')
  async findOne(@Param('id') id: string): Promise<AttendanceEntity> {
    return this.attendanceService.findOne(id);
  }

  /**
   * Updates an existing attendance record by its ID.
   *
   * @param id - The ID of the attendance record to update.
   * @param updateAttendanceDto - The updated attendance data.
   * @returns A promise that resolves to an array of updated `AttendanceEntity`.
   */
  @Patch('/update-attendance/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity[]> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  /**
   * Deletes an attendance record by its ID.
   *
   * @param id - The ID of the attendance record to delete.
   * @returns A promise that resolves to an array of remaining `AttendanceEntity`.
   */
  @Delete('/delete-attendance/:id')
  async remove(@Param('id') id: string): Promise<AttendanceEntity[]> {
    return this.attendanceService.remove(id);
  }
}
