import { EXERCISE_TYPE } from '@src/exercises/enum/exercise.type';
import { IsString, IsOptional } from 'class-validator';

export default class SearchQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  student_id?: string;

  @IsString()
  @IsOptional()
  exercise_type?: EXERCISE_TYPE;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}