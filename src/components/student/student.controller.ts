import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { StudentEntity } from './entity/student.entity';

@Controller('student')
@UseFilters(HttpExceptionFilter)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/add-student')
  create(@Body() createStudentDto: CreateStudentDto):Promise<StudentEntity> {
    return this.studentService.create(createStudentDto);
  }

  @Get('/get-allStudent')
  findAll():Promise<StudentEntity[]> {
    return this.studentService.findAll();
  }

  @Get('/get-analytics')
  getAnalytics():Promise<unknown[]>{
    return this.studentService.getAnalyticsData();
  }

  @Get('/vacant-seats')
  getVacantSeats(@Query() query: any){
    return this.studentService.getVacantSeats(query);
  }

  @Get('/get-student/:id')
  findOne(@Param('id') id: string):Promise<StudentEntity> {
    return this.studentService.findOne(id);
  }

  @Patch('/update-student/:id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto):Promise<StudentEntity[]> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete('/delete-student/:id')
  remove(@Param('id') id: string):Promise<StudentEntity[]> {
    return this.studentService.remove(id);
  }

  @Delete('/deleteAll')
  removeAll():Promise<{message:string}>{
    return this.studentService.removeAll();
  }

  
}

