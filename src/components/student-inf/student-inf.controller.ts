import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseFilters, UseGuards} from '@nestjs/common';
import { StudentInfService } from './student-inf.service';
import {Request} from 'express';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';
import { UpdateStudentInfDto } from './dto/update-student-inf.dto';
import { StudentEntity } from '../student/entity/student.entity';
import { TokenEntity } from '../user/entity/token.entity';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { Roles } from 'src/guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';
import { RoleGuard } from 'src/guards/authorization.guard';

@Controller('student-inf')
@UseFilters(HttpExceptionFilter)
@Roles(UserRole.Student)
@UseGuards(RoleGuard)
export class StudentInfController {
  constructor(private readonly studentInfService: StudentInfService) {}

  @Get('/get-details/:username')
  findAll(@Param('username') username: string):Promise<StudentEntity[]> {
    return this.studentInfService.getStudent(username);
  };

}
