import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { geminiConfig } from '../../config/gemini.config.js';

export interface TopicContext {
  title: string;
  description?: string;
}
export interface ParsedTopic {
  title: string;
  description: string|null;
}
@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (geminiConfig.apiKey) {
      this.genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
    }
  }

  /**
   * 1. Summarization (short | medium | detailed)
   */
  async generateSummary(
    topics: TopicContext[],
    depth: 'short' | 'medium' | 'detailed',
  ): Promise<string> {
    const topicsText = topics
      .map((t) => `- ${t.title}: ${t.description || 'N/A'}`)
      .join('\n');

    const prompt = `You are an educational summarizer.
Topics to summarize:
${topicsText}

Instructions: Provide a ${depth} summary.`;

    return this.runTextQuery(prompt);
  }

  /**
   * 2. Quiz Generation (QCM, True/False, Open Text, Fill Blanks)
   */
  async generateQuizQuestions(
    topics: TopicContext[],
    difficulty: 'easy' | 'medium' | 'hard',
    format: 'multiple_choice' | 'open_text' | 'fill_blanks' | 'true_false',
    count: number,
  ): Promise<any[]> {
    const topicsText = topics
      .map((t) => `- ${t.title}: ${t.description || 'N/A'}`)
      .join('\n');

    const model = this.genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              questionText: { type: SchemaType.STRING },
              format: { type: SchemaType.STRING },
              difficulty: { type: SchemaType.STRING },
              correctAnswer: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                description: 'Required for multiple_choice',
              },
            },
            required: ['questionText', 'format', 'difficulty', 'correctAnswer'],
          },
        },
      },
    });

    const prompt = `Generate ${count} ${difficulty} level ${format} quiz questions based on:
${topicsText}`;

    try {
      const result = await this.generateWithRetry(model, prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      this.logger.error('Error generating quiz', error);
      throw error;
    }
  }

  /**
   * 3. Ask AI (Q&A inside Lesson / Topic context)
   */
  async generateAnswer(
    question: string,
    lessonContext: string,
    topicContext?: string,
  ): Promise<string> {
    const prompt = `You are a helpful educational tutor.
Context: Lesson "${lessonContext}" ${topicContext ? `> Topic "${topicContext}"` : ''}

Student Question: "${question}"

Provide a clear, simple, concise (2-3 paragraphs max) answer with examples if applicable.`;

    return this.runTextQuery(prompt);
  }

  /**
   * Helper function for standard text queries
   */
  private async runTextQuery(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: geminiConfig.model,
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Gemini API Error:', error);
      throw error;
    }
  }
  /**
   * Parse raw unstructured text into structured topics using Gemini
   */
  async parseUnstructuredText(rawText: string): Promise<ParsedTopic[]> {
    const model = this.genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              description: { type: SchemaType.STRING },
            },
            required: ['title', 'description'],
          },
        },
      },
    });

    const prompt = `You are an expert content structuring assistant.
Analyze the following unstructured text from a study lesson and break it down into logically organized topics with titles and concise descriptions.

Raw Text:
${rawText}`;

    try {
      const result = await this.generateWithRetry(model, prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      this.logger.error('Error parsing unstructured text:', error);
      throw error;
    }
  }

  // src/modules/gemini/gemini.service.ts

  private async generateWithRetry(
    model: any,
    prompt: string,
    retries = 3,
    delay = 1000,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        return await model.generateContent(prompt);
      } catch (error: any) {
        if (error?.status === 503 && i < retries - 1) {
          this.logger.warn(
            `Gemini 503 Overload. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; 
        } else {
          throw error;
        }
      }
    }
  }
}
