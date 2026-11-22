import { Exercise } from '@src/exercises/exercise.entity';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ExerciseGroup } from '../training.entity';

export class CreateTrainingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  show_to_student: boolean;

  @IsString()
  @IsOptional()
  student_id?: string;

  @IsArray()
  exercises?: Exercise[];

  @IsArray()
  @IsOptional()
  exercise_groups?: ExerciseGroup[];
}
