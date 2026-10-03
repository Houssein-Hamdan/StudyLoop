import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  questionText: string;

  @IsUUID()
  @IsOptional()
  topicId?: string;
}