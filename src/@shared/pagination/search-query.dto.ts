import { IsString, IsOptional } from 'class-validator';

export default class SearchQueryDto {
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}