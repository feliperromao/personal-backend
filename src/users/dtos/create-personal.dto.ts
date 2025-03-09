import { IsString } from 'class-validator';

export class CreatePersonalDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
