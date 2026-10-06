import { Injectable } from '@nestjs/common';
import { Topic } from '../../entities/topic.entity.js';
import { GroqService } from '../groq/groq.service.js';
import { SummarizationFailedException } from '../../exceptions/auth.exceptions.js';

interface TopicContext {
  title: string;
  description?: string;
}

@Injectable()
export class SummarizationService {
  constructor(private readonly groqService: GroqService) {}

  /**
   * Generate summary from topics using AI
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
        description: t.description ?? '',
      }));

      const topicsText = topicContexts
        .map((t) => `${t.title}: ${t.description || 'N/A'}`)
        .join('\n');

      const prompt = `You are an educational summarizer.

Topics to summarize:
${topicsText}

Instructions:
Provide a ${depth} summary.
NOTE: your answer it must not contain a Bash.
`;

      return await this.groqService.generateText(prompt);
    } catch (error) {
      if (error instanceof SummarizationFailedException) {
        throw error;
      }

      throw new SummarizationFailedException();
    }
  }
}