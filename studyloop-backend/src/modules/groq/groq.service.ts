import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { groqConfig } from '../../config/groq.config.js';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly groq: Groq;

  constructor() {
    if (!groqConfig.apiKey) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    this.groq = new Groq({
      apiKey: groqConfig.apiKey,
    });
  }

  async generateText(
    prompt: string,
    retries = 3,
    delay = 1000,
  ): Promise<string> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await this.groq.chat.completions.create({
          model: groqConfig.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_completion_tokens: 8192,
        });

        return response.choices[0]?.message?.content || '';
      } catch (error: any) {
        const status = error?.status;

        if ((status === 429 || status === 503) && i < retries - 1) {
          this.logger.warn(
            `Groq transient error (${status}). ` +
              `Retrying in ${delay}ms... ` +
              `(Attempt ${i + 1}/${retries})`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));

          delay *= 2;
        } else {
          this.logger.error('Groq API Error:', error?.stack || error);

          throw error;
        }
      }
    }

    throw new Error('Groq request failed after all retries.');
  }
}
