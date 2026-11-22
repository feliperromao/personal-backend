import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class GroupExerciseLoadDto {
  @IsString()
  exercise_id: string;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  load: number;
}

export class CompleteGroupSeriesDto {
  @IsString()
  id: string;

  @IsString()
  group_id: string;

  @IsInt()
  @Min(1)
  series: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupExerciseLoadDto)
  exercises: GroupExerciseLoadDto[];
}
