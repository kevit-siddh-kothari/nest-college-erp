import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
@Roles(UserRole.Admin)
@UseGuards(RoleGuard)
@UseFilters(HttpExceptionFilter)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post('/add-batch')
  create(@Body() createBatchDto: CreateBatchDto): Promise<BatchEntity> {
    return this.batchService.create(createBatchDto);
  }

  @Get('/allbatches')
  findAll(): Promise<BatchEntity[]> {
    return this.batchService.findAll();
  }

  @Get('/batch-id/:id')
  findOne(@Param('id') id: string): Promise<BatchEntity> {
    return this.batchService.findOne(id);
  }

  @Put('/batch-update/:id')
  update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ): Promise<BatchEntity[]> {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete('/batch-delete/:id')
  remove(@Param('id') id: string): Promise<BatchEntity[]> {
    return this.batchService.remove(id);
  }

  @Delete('/deleteAll')
  removeAll(): Promise<{ message: String }> {
    return this.batchService.removeAll();
  }
}
