import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateExerciseDto {

  @IsString()
  name: string;

  @IsString()
  type: EXERCISE_TYPE;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  video?: string;

  @IsNumber()
  rest: number;

  @IsNumber()
  load: number;

  @IsNumber()
  series: number;

  @IsBoolean()
  load_progress: boolean
}
