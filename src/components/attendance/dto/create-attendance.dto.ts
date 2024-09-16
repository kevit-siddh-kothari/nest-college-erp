import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean({ message: 'isPresent must be a boolean value' })
  @IsNotEmpty({ message: 'Attendance status is required' })
  readonly isPresent: boolean;

  @IsNotEmpty({ message: 'Student reference is required' })
  readonly student: string;
}
