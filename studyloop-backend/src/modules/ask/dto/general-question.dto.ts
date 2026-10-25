import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GeneralQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  @MaxLength(2000, {
    message: 'Question must not exceed 2000 characters',
  })
  questionText: string;
}