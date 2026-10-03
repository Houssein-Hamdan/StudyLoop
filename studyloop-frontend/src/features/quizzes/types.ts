export type QuizScope = "full_lesson" | "selected_topics" | "random";

export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizFormat =
  | "multiple_choice"
  | "open_text"
  | "fill_blanks"
  | "true_false";

export type CreateQuizPayload = {
  scope: QuizScope;
  selectedTopicIds?: string[];
  difficulty: QuizDifficulty;
  format: QuizFormat;
  questionCount: number;
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  format: QuizFormat;
  order: number;
  options?: string[];
};
export type Quiz = {
  id: string;
  lessonId: string;
  scope: QuizScope;
  difficulty: QuizDifficulty;
  format: QuizFormat;
  questionCount: number;
  questions: QuizQuestion[];
  createdAt: string;
};

export type QuizResponse = {
  message: string;
  quiz: Quiz;
};

export type SubmitQuizAnswer = {
  questionId: string;
  userAnswer: string;
};

export type SubmitQuizPayload = {
  quizId: string;
  answers: SubmitQuizAnswer[];
};

export type QuizResult = {
  quizId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: string;
};

export type SubmitQuizResponse = {
  message: string;
  results: QuizResult;
};

export type QuizListResponse = {
  message: string;
  count: number;
  quizzes: Quiz[];
};

