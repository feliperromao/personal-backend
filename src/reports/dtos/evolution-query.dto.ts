import { IsOptional, IsString } from 'class-validator';

export class EvolutionQueryDto {
  @IsOptional()
  @IsString()
  student_id?: string;

  @IsOptional()
  @IsString()
  exercise_id?: string;
}
