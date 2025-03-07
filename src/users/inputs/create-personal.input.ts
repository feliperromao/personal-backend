import { IsString } from 'class-validator';

export class CreatePersonalInput {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
