import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service.js';
import { AIResponseFailedException } from '../../exceptions/auth.exceptions.js';

@Injectable()
export class AIService {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * Generate AI response for a question using Gemini
   */
  async generateResponse(
    questionText: string,
    lessonContext: string,
    topicContext?: string,
  ): Promise<string> {
    try {
      if (!questionText || !questionText.trim()) {
        throw new AIResponseFailedException();
      }

      return await this.geminiService.generateAnswer(
        questionText,
        lessonContext,
        topicContext,
      );
    } catch (error) {
      if (error instanceof AIResponseFailedException) {
        throw error;
      }

      throw new AIResponseFailedException();
    }
  }
}
