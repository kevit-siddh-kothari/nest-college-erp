import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';
import { StudentEntity } from './entity/student.entity';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';

@Controller('student')
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  /**
   * Creates a new student record.
   *
   * @param createStudentDto - The data transfer object containing student details.
   * @returns A promise that resolves to the created `StudentEntity`.
   */
  @Post('/')
  @Roles(UserRole.Admin)
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentEntity> {
    return this.studentService.create(createStudentDto);
  }

  /**
   * Retrieves all student records.
   *
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   */
  @Get('/')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  async findAll(): Promise<StudentEntity[]> {
    return this.studentService.findAll();
  }

  /**
   * Retrieves absent students for a specific date and optional filters.
   *
   * @param query - The query parameters for filtering by batch ID, department ID, and semester.
   * @param date - The date to filter absences by.
   * @returns A promise that resolves to an array of `AttendanceEntity` objects or an error message.
   */
  @Get('/absent-students/:date')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  async getAbsentStudents(
    @Query() query: { batchId?: string; departmentId?: string; sem?: string },
    @Param('date') date: string,
  ): Promise<AttendanceEntity[] | { error: string }> {
    return this.studentService.getAbsentStudents(query, date);
  }

  /**
   * Retrieves students with less than 75% attendance.
   *
   * @param query - The query parameters for filtering by batch ID, department ID, and semester.
   * @returns A promise that resolves to an array of students with less than 75% attendance.
   */
  @Get('/present-students-less-75')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  async getStudentslessThan75(
    @Query() query: { batchId?: string; departmentId?: string; sem?: string },
  ) {
    return this.studentService.getPresentLessThan75(query);
  }

  /**
   * Retrieves analytics data related to students.
   *
   * @returns A promise that resolves to an array of analytics data.
   */
  @Roles(UserRole.Admin)
  @Get('/analytics')
  async getAnalytics(): Promise<unknown[]> {
    return this.studentService.getAnalyticsData();
  }

  /**
   * Retrieves vacant seats based on query parameters.
   *
   * @param query - The query parameters for retrieving vacant seats.
   * @returns A promise that resolves to the vacant seat information.
   */
  @Roles(UserRole.Admin)
  @Get('/vacant-seats')
  async getVacantSeats(@Query() query: any) {
    return this.studentService.getVacantSeats(query);
  }

  /**
   * Retrieves a student record by ID.
   *
   * @param id - The ID of the student to retrieve.
   * @returns A promise that resolves to the `StudentEntity` with the specified ID.
   */
  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<StudentEntity> {
    return this.studentService.findOne(id);
  }

  /**
   * Updates an existing student record by ID.
   *
   * @param id - The ID of the student to update.
   * @param updateStudentDto - The data transfer object containing updated student details.
   * @returns A promise that resolves to the updated `StudentEntity` array.
   */
  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity[]> {
    return this.studentService.update(id, updateStudentDto);
  }

  /**
   * Deletes all student records.
   *
   * @returns A promise that resolves to an object with a success message.
   */
  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Delete('/deleteAll')
  async removeAll(): Promise<{ message: string }> {
    return this.studentService.removeAll();
  }

  /**
   * Deletes a student record by ID.
   *
   * @param id - The ID of the student to delete.
   * @returns A promise that resolves to an array of remaining `StudentEntity` objects.
   */
  @Roles(UserRole.Admin)
  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<StudentEntity[]> {
    return this.studentService.remove(id);
  }
}
