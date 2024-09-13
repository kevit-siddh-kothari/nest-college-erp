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
import { query } from 'express';
import { AttendanceEntity } from '../attendance/entity/attendance.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';

@Controller('student')
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/add-student')
  @Roles(UserRole.Admin)
  create(@Body() createStudentDto: CreateStudentDto): Promise<StudentEntity> {
    return this.studentService.create(createStudentDto);
  }

  @Get('/get-allStudent')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  findAll(): Promise<StudentEntity[]> {
    return this.studentService.findAll();
  }

  @Get('/get-absent-students/:date')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  getAbsentStudents(
    @Query() query: { batchId?: string; departmentId?: string; sem?: string },
    @Param('date') date: string,
  ): Promise<AttendanceEntity[] | { error: string }> {
    return this.studentService.getAbsentStudents(query, date);
  }

  @Get('/get-present-students-less-75')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  getStudentslessThan75(
    @Query() query: { batchId?: string; departmentId?: string; sem?: string },
  ) {
    return this.studentService.getPresentLessThan75(query);
  }

  @Roles(UserRole.Admin)
  @Get('/get-analytics')
  getAnalytics(): Promise<unknown[]> {
    return this.studentService.getAnalyticsData();
  }

  @Roles(UserRole.Admin)
  @Get('/vacant-seats')
  getVacantSeats(@Query() query: any) {
    return this.studentService.getVacantSeats(query);
  }

  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Get('/get-student/:id')
  findOne(@Param('id') id: string): Promise<StudentEntity> {
    return this.studentService.findOne(id);
  }

  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Patch('/update-student/:id')
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentEntity[]> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Roles(UserRole.Admin)
  @Delete('/delete-student/:id')
  remove(@Param('id') id: string): Promise<StudentEntity[]> {
    return this.studentService.remove(id);
  }

  @Roles(UserRole.Admin, UserRole.StaffMember)
  @Delete('/deleteAll')
  removeAll(): Promise<{ message: string }> {
    return this.studentService.removeAll();
  }
}
