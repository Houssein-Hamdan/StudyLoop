export type AskAnswer = {
  id: string;
  answerText: string;
  status: string;
  aiProvider: string;
  createdAt: string;
};

export type AskQuestion = {
  id: string;
  lessonId: string;
  userId: string;
  questionText: string;
  topicId: string | null;
  answers: AskAnswer[];
  createdAt: string;
  updatedAt: string;
};

export type CreateQuestionPayload = {
  questionText: string;
  topicId?: string;
};

export type AskQuestionResponse = {
  message: string;
  question: AskQuestion;
};

export type AskQuestionsResponse = {
  message: string;
  count: number;
  questions: AskQuestion[];
};