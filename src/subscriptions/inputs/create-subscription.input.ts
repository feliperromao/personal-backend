import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateSubscriptionInput {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  max_students: number;

  @IsInt()
  @Min(1)
  max_exercises: number;

  @IsInt()
  @Min(1)
  max_training: number;

  @IsNumber()
  @Min(0)
  price_brl: number;
}
