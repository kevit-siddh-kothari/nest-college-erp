import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchDetailsDto } from './create-batch-detail.dto';

export class UpdateBatchDetailDto extends PartialType(CreateBatchDetailsDto) {}
