import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BatchDetailsService } from './batch-details.service';
import { CreateBatchDetailsDto } from './dto/create-batch-detail.dto';
import { UpdateBatchDetailDto } from './dto/update-batch-detail.dto';
import { BatchDetailsEntity } from '../entity/batch.details.entity';
import { RoleGuard } from '../../../guards/authorization.guard';
import { Roles } from '../../../guards/guard.role.decorator';
import { UserRole } from '../../user/entity/user.entity';

@Controller('batch-details')
@UseGuards(RoleGuard)
@Roles(UserRole.Admin)
export class BatchDetailsController {
  constructor(private readonly batchDetailsService: BatchDetailsService) {}

  /**
   * Creates new batch details.
   *
   * @param createBatchDetailDto - DTO containing details for creating a new batch.
   * @returns A promise that resolves to the created `BatchDetailsEntity`.
   */
  @Post('/')
  create(
    @Body() createBatchDetailDto: CreateBatchDetailsDto,
  ): Promise<BatchDetailsEntity> {
    return this.batchDetailsService.create(createBatchDetailDto);
  }

  /**
   * Retrieves all batch details.
   *
   * @returns A promise that resolves to an array of `BatchDetailsEntity`.
   */
  @Get('/')
  findAll(): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.findAll();
  }

  /**
   * Retrieves batch details by ID.
   *
   * @param id - The ID of the batch detail to retrieve.
   * @returns A promise that resolves to the `BatchDetailsEntity` with the specified ID.
   */
  @Get('/:id')
  findOne(@Param('id') id: string): Promise<BatchDetailsEntity> {
    return this.batchDetailsService.findOne(id);
  }

  /**
   * Updates batch details by ID.
   *
   * @param id - The ID of the batch detail to update.
   * @param updateBatchDetailDto - DTO containing the new details to update.
   * @returns A promise that resolves to an array containing the updated `BatchDetailsEntity`.
   */
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateBatchDetailDto: UpdateBatchDetailDto,
  ): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.update(id, updateBatchDetailDto);
  }

  /**
   * Deletes all batch details.
   *
   * @returns A promise that resolves to an object containing a success message.
   */
  @Delete('/deleteAll')
  removeAll(): Promise<{ message: string }> {
    return this.batchDetailsService.removeAll();
  }

  /**
   * Deletes batch details by ID.
   *
   * @param id - The ID of the batch detail to delete.
   * @returns A promise that resolves to an array of remaining `BatchDetailsEntity`.
   */
  @Delete('/:id')
  remove(@Param('id') id: string): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.remove(id);
  }
}
