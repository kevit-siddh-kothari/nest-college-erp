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

  @Post('/add-details')
  create(
    @Body() createBatchDetailDto: CreateBatchDetailsDto,
  ): Promise<BatchDetailsEntity> {
    return this.batchDetailsService.create(createBatchDetailDto);
  }

  @Get('/get-all-details')
  findAll(): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.findAll();
  }

  @Get('/get-details/:id')
  findOne(@Param('id') id: string): Promise<BatchDetailsEntity> {
    return this.batchDetailsService.findOne(id);
  }

  @Patch('/update-details/:id')
  update(
    @Param('id') id: string,
    @Body() updateBatchDetailDto: UpdateBatchDetailDto,
  ): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.update(id, updateBatchDetailDto);
  }

  @Delete('/delete-details/:id')
  remove(@Param('id') id: string): Promise<BatchDetailsEntity[]> {
    return this.batchDetailsService.remove(id);
  }

  @Delete('/deleteAll')
  removeAll(): Promise<{ message: string }> {
    return this.batchDetailsService.removeAll();
  }
}
