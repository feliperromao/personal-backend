import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateExerciseDto {

  @IsString()
  name: string;

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
