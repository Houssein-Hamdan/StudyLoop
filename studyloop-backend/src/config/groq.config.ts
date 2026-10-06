import * as dotenv from 'dotenv';

dotenv.config();

export const groqConfig = {
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
};

// Validation
if (!groqConfig.apiKey) {
  console.warn('WARNING: GROQ_API_KEY is not set.');
}