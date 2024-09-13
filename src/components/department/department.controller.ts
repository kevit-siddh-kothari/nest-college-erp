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
import { HttpExceptionFilter } from '../../exception/http-exception.filter';

@Controller('department')
@Roles(UserRole.Admin)
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  /**
   * Creates a new department.
   *
   * @param createDepartmentDto - The details of the department to create.
   * @returns A promise that resolves to the created `DepartmentEntity`.
   */
  @Post('/add-department')
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentEntity> {
    return this.departmentService.create(createDepartmentDto);
  }

  /**
   * Retrieves all departments.
   *
   * @returns A promise that resolves to an array of `DepartmentEntity`.
   */
  @Get('/all-department')
  @Roles(UserRole.Admin, UserRole.StaffMember)
  async findAll(): Promise<DepartmentEntity[]> {
    return this.departmentService.findAll();
  }

  /**
   * Retrieves a department by its ID.
   *
   * @param id - The ID of the department to retrieve.
   * @returns A promise that resolves to the `DepartmentEntity`.
   */
  @Get('/department/:id')
  async findOne(@Param('id') id: string): Promise<DepartmentEntity> {
    return this.departmentService.findOne(id);
  }

  /**
   * Updates a department by its ID.
   *
   * @param id - The ID of the department to update.
   * @param updateDepartmentDto - The updated department details.
   * @returns A promise that resolves to an array containing the updated `DepartmentEntity`.
   */
  @Patch('/update-department/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentEntity[]> {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  /**
   * Deletes a department by its ID.
   *
   * @param id - The ID of the department to delete.
   * @returns A promise that resolves to an array of remaining `DepartmentEntity`.
   */
  @Delete('/delete-department/:id')
  async remove(@Param('id') id: string): Promise<DepartmentEntity[]> {
    return this.departmentService.remove(id);
  }

  /**
   * Deletes all departments.
   *
   * @returns A promise that resolves to an array of remaining `DepartmentEntity` after deletion.
   */
  @Delete('/deleteall-department')
  public async removeAll(): Promise<DepartmentEntity[]> {
    await this.departmentService.removeAllDeparment();
    return this.findAll();
  }
}
