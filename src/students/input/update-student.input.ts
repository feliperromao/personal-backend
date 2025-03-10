import { IsString, MinLength, IsEmail, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateSudentInput {
  @IsString()
  @IsOptional()
  @MinLength(5)
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  confirm_password?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  birthdate?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  monthly_value_brl?: number;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;
}
