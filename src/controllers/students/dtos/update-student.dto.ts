import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class UpdateSudentDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;
}
