export type TopicProgress = {
  id: string;
  topicId: string;
  isCompleted: boolean;
  completedAt: string | null;
};

export type LessonProgress = {
  id: string;
  lessonId: string;
  userId: string;

  completedTopicsCount: number;
  totalTopicsCount: number;
  completionPercentage: number;
  scrollPosition: number;
  isLessonCompleted: boolean;

  // Review / Spaced Repetition
  lastReviewedAt: string | null;
  nextReviewDate: string | null;
  reviewCount: number;
  reviewIntervalDays: number;

  createdAt: string;
  updatedAt: string;
};

export type TopicProgressResponse = {
  message: string;
  topicProgress: TopicProgress;
  progress: LessonProgress;
};

export type LessonProgressResponse = {
  message: string;
  progress: LessonProgress;
  topicProgress: TopicProgress[];
};