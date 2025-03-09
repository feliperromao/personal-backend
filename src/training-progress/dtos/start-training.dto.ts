import { IsString } from 'class-validator';

export class StartTrainingDto {
  @IsString()
  id: string;
}
