import { IsBoolean } from 'class-validator';

export class UpdateLessonShareDto {
  @IsBoolean()
  isPublic: boolean;
}