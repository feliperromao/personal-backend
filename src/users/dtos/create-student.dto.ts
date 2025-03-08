import { IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  personal_id: string;
}
