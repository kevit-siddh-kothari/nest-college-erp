import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentInfDto } from './create-student-inf.dto';

export class UpdateStudentInfDto extends PartialType(CreateStudentInfDto) {}
