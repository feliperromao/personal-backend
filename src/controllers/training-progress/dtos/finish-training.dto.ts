import { FINISH_STATUS } from '@src/training-progress/enum/finish-status.enum';
import { IsOptional, IsString } from 'class-validator';

export class FinishTrainingDto {
  @IsString()
  id: string;

  @IsString()
  status: FINISH_STATUS;

  @IsString()
  @IsOptional()
  feedback?: string;
}