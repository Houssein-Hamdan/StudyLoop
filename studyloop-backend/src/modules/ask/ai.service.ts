import { Injectable } from '@nestjs/common';
import { GroqService } from '../groq/groq.service.js';
import { AIResponseFailedException } from '../../exceptions/auth.exceptions.js';

@Injectable()
export class AIService {
  constructor(private readonly groqService: GroqService) {}

  /**
   * Generate AI response for a question using Groq
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

      const prompt = `You are a helpful educational tutor.
Context: Lesson "${lessonContext}" ${topicContext ? `> Topic "${topicContext}"` : ''}

Student Question: "${questionText}"


NOTE: your answer it must not contain a Bash.
Provide a clear, simple, concise (2-3 paragraphs max) answer with examples if applicable.
`;

      return await this.groqService.generateText(prompt);
    } catch (error) {
      if (error instanceof AIResponseFailedException) {
        throw error;
      }

      throw new AIResponseFailedException();
    }
  }
}