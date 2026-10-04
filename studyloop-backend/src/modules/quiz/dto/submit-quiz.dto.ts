import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
  ArrayMinSize,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export class QuizAnswerDto {
  @IsUUID('4')
  @IsNotEmpty({ message: 'Question ID is required' })
  questionId: string;

  @IsString()
  @IsNotEmpty({ message: 'User answer is required' })
  userAnswer: string;
}

export class SubmitQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];
}
