import { Exercise } from '@src/exercises/exercise.entity';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  show_to_student: boolean;

  @IsString()
  student_id: string;

  @IsArray()
  exercises?: Exercise[];
}
