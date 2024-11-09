import { IsString, IsOptional } from 'class-validator';

export default class GetStudentsDto {
  @IsString()
  @IsOptional()
  name: string;
}