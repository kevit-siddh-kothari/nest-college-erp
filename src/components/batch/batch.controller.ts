import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchEntity } from './entity/batch.year.entity';
import { RoleGuard } from '../../guards/authorization.guard';
import { Roles } from '../../guards/guard.role.decorator';
import { UserRole } from '../user/entity/user.entity';
import { HttpExceptionFilter } from '../../exception/http-exception.filter';

@Controller('batch')
@Roles(UserRole.ADMIN)
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  /**
   * Creates a new batch.
   *
   * @param createBatchDto - The data to create a new batch.
   * @returns A promise that resolves to the created `BatchEntity`.
   */
  @Post('/')
  async create(@Body() createBatchDto: CreateBatchDto): Promise<BatchEntity> {
    return this.batchService.create(createBatchDto);
  }

  /**
   * Retrieves all batches.
   *
   * @returns A promise that resolves to an array of `BatchEntity`.
   */
  @Get('/')
  async findAll(): Promise<BatchEntity[]> {
    return this.batchService.findAll();
  }

  /**
   * Retrieves a batch by its ID.
   *
   * @param id - The ID of the batch to retrieve.
   * @returns A promise that resolves to the `BatchEntity`.
   */
  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<BatchEntity> {
    return this.batchService.findOne(id);
  }

  /**
   * Updates a batch by its ID.
   *
   * @param id - The ID of the batch to update.
   * @param updateBatchDto - The data to update the batch.
   * @returns A promise that resolves to an array containing the updated `BatchEntity`.
   */
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ): Promise<BatchEntity[]> {
    return this.batchService.update(id, updateBatchDto);
  }

  /**
   * Deletes all batches.
   *
   * @returns A promise that resolves to an object containing a message indicating success.
   */
  @Delete('/deleteAll')
  async removeAll(): Promise<{ message: string }> {
    return this.batchService.removeAll();
  }

  /**
   * Deletes a batch by its ID.
   *
   * @param id - The ID of the batch to delete.
   * @returns A promise that resolves to an array of remaining `BatchEntity`.
   */
  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<BatchEntity[]> {
    return this.batchService.remove(id);
  }
}
