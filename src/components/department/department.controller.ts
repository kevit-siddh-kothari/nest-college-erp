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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entity/department.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('department')
@Roles(UserRole.Admin)
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('/add-department')
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get('/all-department')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  findAll(): Promise<DepartmentEntity[]> {
    return this.departmentService.findAll();
  }

  @Get('/department/:id')
  findOne(@Param('id') id: string): Promise<DepartmentEntity> {
    return this.departmentService.findOne(id);
  }

  @Patch('/update-department/:id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEntity[]> {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete('/delete-department/:id')
  remove(@Param('id') id: string): Promise<DepartmentEntity[]> {
    return this.departmentService.remove(id);
  }

  @Delete('/deleteall-department')
  public async removeAll(): Promise<DepartmentEntity[]> {
    await this.departmentService.removeAllDeparment();
    return this.findAll();
  }
}
