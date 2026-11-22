import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePersonalDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  phone: string;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;
}
