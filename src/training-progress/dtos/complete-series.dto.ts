import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CompleteSeriesDto {
  @IsString()
  id: string;

  @IsString()
  exercise_id: string;

  @IsInt()
  @Min(1)
  series: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  load: number;
}
