import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreatePersonalDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  phone: string;
}
