import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { geminiConfig } from '../../config/gemini.config.js';
import {
  AIResponseFailedException,
  QuizGenerationFailedException,
  SummarizationFailedException,
} from '../../exceptions/auth.exceptions.js'; 

export interface TopicContext {
  title: string;
  description?: string;
}

export interface ParsedTopic {
  title: string;
  description: string | null;
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
      .map((t) => `${t.title}: ${t.description || 'N/A'}`)
      .join('\n');

    const prompt = `You are an educational summarizer.
Topics to summarize:
${topicsText}

Instructions: Provide a ${depth} summary.`;

    try {
      return await this.runTextQuery(prompt);
    } catch (error) {
      this.logger.error('Error generating summary:', error);
      throw new SummarizationFailedException();
    }
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
      .map((t) => `${t.title}: ${t.description || 'N/A'}`)
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
      this.logger.error('Error generating quiz:', error);
      throw new QuizGenerationFailedException();
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

    const prompt = `You are a text segmentation assistant.
Your ONLY task is to split the provided raw text into logical topics/sections WITHOUT changing, summarizing, rewording, or omitting any words.

CRITICAL RULES:
1. Preserve the EXACT wording, phrasing, and sentences from the original text in the 'description' field.
2. DO NOT summarize, rephrase, condense, or edit the content.
3. Every sentence from the original input must appear in one of the topic descriptions in its original order.
4. Provide a clear, relevant 'title' for each identified section.

Raw Text:
${rawText}`;

    try {
      const result = await this.generateWithRetry(model, prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      this.logger.error('Error parsing unstructured text:', error);
      throw new AIResponseFailedException();
    }
  }

  /**
   * Helper function for standard text queries
   */
  private async runTextQuery(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: geminiConfig.model,
      });
      const result = await this.generateWithRetry(model, prompt);
      return result.response.text();
    } catch (error) {
      this.logger.error('Gemini API Error:', error);
      throw new AIResponseFailedException();
    }
  }

  /**
   * Helper function to handle AI calls with retry logic
   */
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
        // Retry on 503 Overload or 429 Rate Limit
        if ((error?.status === 503 || error?.status === 429) && i < retries - 1) {
          this.logger.warn(
            `Gemini transient error (${error?.status}). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw new AIResponseFailedException();
        }
      }
    }
  }
}