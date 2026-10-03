import { IsBoolean } from 'class-validator';

export class UpdateTopicProgressDto {
  @IsBoolean()
  isCompleted: boolean;
}