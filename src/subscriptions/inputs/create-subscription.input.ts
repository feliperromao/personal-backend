import { IsString, IsNumber } from 'class-validator';

export class CreateSubscriptionInput {
  @IsString()
  name: string;

  @IsNumber()
  max_students: number;

  @IsNumber()
  max_exercises: number;

  @IsNumber()
  max_training: number;

  @IsNumber()
  price_brl: number;
}
