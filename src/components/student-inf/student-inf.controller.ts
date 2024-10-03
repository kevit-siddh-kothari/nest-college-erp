import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { StudentInfService } from './student-inf.service';
import { StudentEntity } from '../student/entity/student.entity';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { CreateStudentInfDto } from './dto/create-student-inf.dto';

@Controller('student-inf')
@UseFilters(HttpExceptionFilter)
@Roles(UserRole.STUDENT)
@UseGuards(RoleGuard)
export class StudentInfController {
  constructor(private readonly studentInfService: StudentInfService) {}

  /**
   * Retrieves student details based on the provided username.
   * This method fetches a list of `StudentEntity` objects that match the provided username.
   * The request must be authenticated and the user must have the `Student` role to access this endpoint.
   *
   * @param username - The username of the student whose details are to be retrieved.
   * @returns A promise that resolves to an array of `StudentEntity` objects.
   */
  @Get('/get-details/:username')
  async findAll(
    @Param('username') username: CreateStudentInfDto,
  ): Promise<StudentEntity[]> {
    return this.studentInfService.getStudent(username);
  }
}
