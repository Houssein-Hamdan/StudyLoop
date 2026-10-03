export type HomeStats = {
  totalLessons: number;
  completedLessons: number;
  totalTopics: number;
  totalCompleted: number;
  averageCompletion: number;
  lessonsInProgress: number;
};

export type HomeActivity = {
  lessonId: string;
  lessonTitle: string;
  containerId: string;
  totalTopics: number;
  completedTopics: number;
  progressPercentage: number;
  lastAccessedAt: string;
};