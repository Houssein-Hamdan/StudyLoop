import { Injectable } from '@nestjs/common';
import { Topic } from '../../entities/topic.entity.js';
import { GeminiService, TopicContext } from '../gemini/gemini.service.js';
import { SummarizationFailedException } from '../../exceptions/auth.exceptions.js';

@Injectable()
export class SummarizationService {
  constructor(private readonly geminiService: GeminiService) {}

  /**
   * Generate summary from topics using Gemini AI
   */
  async generateSummary(
    topics: Topic[],
    depth: 'short' | 'medium' | 'detailed',
  ): Promise<string> {
    try {
      if (!topics || topics.length === 0) {
        throw new SummarizationFailedException();
      }

      const topicContexts: TopicContext[] = topics.map((t) => ({
        title: t.title,
        description: t.description??'',
      }));

      return await this.geminiService.generateSummary(topicContexts, depth);
    } catch (error) {
      if (error instanceof SummarizationFailedException) {
        throw error;
      }

      throw new SummarizationFailedException();
    }
  }
}
