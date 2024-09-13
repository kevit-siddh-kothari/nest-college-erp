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

  @Post('/add-attendance')
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceEntity> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get('/get-all-attendance')
  findAll(): Promise<AttendanceEntity[]> {
    return this.attendanceService.findAll();
  }

  @Get('/get-attendance/:id')
  findOne(@Param('id') id: string): Promise<AttendanceEntity> {
    return this.attendanceService.findOne(id);
  }

  @Patch('/update-attendance/:id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceEntity[]> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete('/delete-attendance/:id')
  remove(@Param('id') id: string): Promise<AttendanceEntity[]> {
    return this.attendanceService.remove(id);
  }
}
