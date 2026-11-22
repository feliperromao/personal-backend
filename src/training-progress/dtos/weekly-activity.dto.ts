import { IsDateString } from 'class-validator';

export class WeeklyActivityDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}
