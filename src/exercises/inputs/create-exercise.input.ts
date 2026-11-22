import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateExerciseInput {

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
  series: number;

}
