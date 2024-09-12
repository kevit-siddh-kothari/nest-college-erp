import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { StudentEntity } from 'src/components/student/entity/student.entity';

export class CreateAttendanceDto {
  @IsBoolean({ message: 'isPresent must be a boolean value' })
  @IsNotEmpty({ message: 'Attendance status is required' })
  readonly isPresent: boolean;

  @IsNotEmpty({ message: 'Student reference is required' })
  readonly student: string;
}
