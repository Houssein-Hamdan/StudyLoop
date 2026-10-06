import { Injectable } from '@nestjs/common';
import type { Topic } from '../../entities/topic.entity.js';
import { GroqService } from '../groq/groq.service.js';
import { QuizGenerationFailedException } from '../../exceptions/auth.exceptions.js';

export interface GeneratedQuestion {
  questionText: string;
  format:
    | 'multiple_choice'
    | 'open_text'
    | 'fill_blanks'
    | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  correctAnswer: string;
  options?: string[];
}

@Injectable()
export class QuizGeneratorService {
  constructor(private readonly groqService: GroqService) {}

  async generateQuestions(
    topics: Topic[],
    difficulty: 'easy' | 'medium' | 'hard',
    format:
      | 'multiple_choice'
      | 'open_text'
      | 'fill_blanks'
      | 'true_false',
    questionCount: number,
  ): Promise<GeneratedQuestion[]> {
    try {
      if (!topics || topics.length === 0 || questionCount <= 0) {
        throw new QuizGenerationFailedException();
      }

      const topicsText = topics
        .map((t) => `${t.title}: ${t.description || 'N/A'}`)
        .join('\n');

      const prompt = `You are an educational quiz generator.

Generate ${questionCount} ${difficulty} level ${format} quiz questions based on:

${topicsText}

Return ONLY valid JSON.
The response must be a JSON array.

Each question must have:
- questionText: string
- format: "${format}"
- difficulty: "${difficulty}"
- correctAnswer: string
- options: string[] (required only for multiple_choice)

Do not include any explanation outside the JSON.`;

      const rawResponse = await this.groqService.generateText(prompt);

      const rawQuestions = JSON.parse(rawResponse);

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