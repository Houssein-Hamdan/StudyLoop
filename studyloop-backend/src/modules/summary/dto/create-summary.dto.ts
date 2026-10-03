import { IsNotEmpty, IsEnum, IsArray, IsOptional, IsUUID } from 'class-validator';

export enum SummaryDepth {
  SHORT = 'short',
  MEDIUM = 'medium',
  DETAILED = 'detailed',
}

export class CreateSummaryDto {
  @IsEnum(SummaryDepth)
  @IsNotEmpty({ message: 'Depth is required' })
  depth: SummaryDepth;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  selectedTopicIds?: string[];
}