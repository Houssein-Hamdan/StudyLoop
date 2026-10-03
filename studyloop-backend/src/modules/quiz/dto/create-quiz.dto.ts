import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export enum QuizScope {
  FULL_LESSON = 'full_lesson',
  SELECTED_TOPICS = 'selected_topics',
  RANDOM = 'random',
}

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuizFormat {
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN_TEXT = 'open_text',
  FILL_BLANKS = 'fill_blanks',
  TRUE_FALSE = 'true_false',
}

export class CreateQuizDto {
  @IsEnum(QuizScope)
  @IsNotEmpty({ message: 'Scope is required' })
  scope: QuizScope;

  @IsArray()
  @IsOptional()
  @IsUUID('4', { each: true })
  selectedTopicIds?: string[];

  @IsEnum(QuizDifficulty)
  @IsNotEmpty({ message: 'Difficulty is required' })
  difficulty: QuizDifficulty;

  @IsEnum(QuizFormat)
  @IsNotEmpty({ message: 'Format is required' })
  format: QuizFormat;

  @IsInt()
  @Min(1, { message: 'Question count must be at least 1' })
  @Max(50, { message: 'Question count cannot exceed 50' })
  questionCount: number;
}