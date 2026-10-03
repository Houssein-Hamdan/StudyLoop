import * as dotenv from 'dotenv';

dotenv.config();

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
};

// Validation
if (!geminiConfig.apiKey) {
  console.warn('WARNING: GEMINI_API_KEY is not set.');
}