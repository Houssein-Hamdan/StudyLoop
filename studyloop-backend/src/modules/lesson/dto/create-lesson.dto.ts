import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty({ message: 'Topic title is required' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;
}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rawContent?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTopicDto)
  topics?: CreateTopicDto[];
}
