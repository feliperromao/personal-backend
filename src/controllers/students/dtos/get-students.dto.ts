import { IsString, IsOptional } from 'class-validator';

export default class GetStudentsDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}