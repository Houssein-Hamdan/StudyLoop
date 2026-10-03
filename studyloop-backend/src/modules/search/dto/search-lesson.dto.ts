import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchLessonDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  @IsIn(['in_progress', 'mastered', 'all'])
  status?: 'in_progress' | 'mastered' | 'all';

  @IsString()
  @IsOptional()
  @IsIn(['newest', 'oldest', 'most_completed'])
  sortBy?: 'newest' | 'oldest' | 'most_completed';

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