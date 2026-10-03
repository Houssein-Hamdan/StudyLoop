import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchTopicDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  @IsIn(['completed', 'not_completed', 'all'])
  status?: 'completed' | 'not_completed' | 'all';

  @IsString()
  @IsOptional()
  @IsIn(['newest', 'oldest'])
  sortBy?: 'newest' | 'oldest';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 10;
}