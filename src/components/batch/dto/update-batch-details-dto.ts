import { PartialType } from '@nestjs/mapped-types';
import { CreateBatchDetailsDto } from './create-batch-details-dto';

export class UpdateBatchDto extends PartialType(CreateBatchDetailsDto) {}
