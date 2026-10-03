import { Injectable } from '@nestjs/common';
import type { Topic } from '../../entities/topic.entity.js';
import { GeminiService, TopicContext } from '../gemini/gemini.service.js';
import { QuizGenerationFailedException } from '../../exceptions/auth.exceptions.js';

export interface GeneratedQuestion {
  questionText: string;
  format: 'multiple_choice' | 'open_text' | 'fill_blanks' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  correctAnswer: string;
  options?: string[];
}

@Injectable()
export class QuizGeneratorService {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * Generate quiz questions using Gemini AI
   */
  async generateQuestions(
    topics: Topic[],
    difficulty: 'easy' | 'medium' | 'hard',
    format: 'multiple_choice' | 'open_text' | 'fill_blanks' | 'true_false',
    questionCount: number,
  ): Promise<GeneratedQuestion[]> {
    try {
      // 1. Validation check
      if (!topics || topics.length === 0 || questionCount <= 0) {
        throw new QuizGenerationFailedException();
      }

      // 2. Map Topic entities to TopicContext
      const topicContexts: TopicContext[] = topics.map((t) => ({
        title: t.title,
        description: t.description ?? '',
      }));

      // 3. Call Gemini AI Service
      const rawQuestions = await this.geminiService.generateQuizQuestions(
        topicContexts,
        difficulty,
        format,
        questionCount,
      );

      // 4. Transform and ensure 'order' property is included
      if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new QuizGenerationFailedException();
      }

      if (rawQuestions.length < questionCount) {
        throw new QuizGenerationFailedException();
      }

      return rawQuestions.slice(0, questionCount).map((q, index) => {
        if (!q.questionText || !q.correctAnswer) {
          throw new QuizGenerationFailedException();
        }

        return {
          questionText: q.questionText,
          format: q.format || format,
          difficulty: q.difficulty || difficulty,
          order: index + 1,
          correctAnswer: q.correctAnswer,
          options: q.options,
        };
      });
    } catch (error) {
      if (error instanceof QuizGenerationFailedException) {
        throw error;
      }

      throw new QuizGenerationFailedException();
    }
  }
}
