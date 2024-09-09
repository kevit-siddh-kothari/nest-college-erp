import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';
import { StudentEntity } from 'src/components/student/entity/student.entity';

export class CreateAttendanceDto {
  
  @IsUUID()
  @IsNotEmpty({ message: 'ID is required' })
  readonly id: string;

  @IsBoolean({ message: 'isPresent must be a boolean value' })
  @IsNotEmpty({ message: 'Attendance status is required' })
  readonly isPresent: boolean;

  @IsNotEmpty({ message: 'Student reference is required' })
  readonly student: StudentEntity;
}
