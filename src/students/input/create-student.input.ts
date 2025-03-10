import { IsString, MinLength, IsEmail, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CreateSudentInput {
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  confirm_password: string;

  @IsString()
  phone: string;

  @IsString()
  birthdate: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsNumber()
  monthly_value_brl: number;

  @IsBoolean()
  blocked: boolean;
}
