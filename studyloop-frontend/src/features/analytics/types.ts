export type AnalyticsOverview = {
  totalLessons: number;
  totalTopics: number;
  completedTopics: number;
  globalCompletionRate: number;
  totalAnnotations: number;
};

export type RecentActivity = {
  lessonId: string;
  lessonTitle: string;
  containerId: string;
  totalTopics: number;
  completedTopics: number;
  progressPercentage: number;
  lastAccessedAt: string;
};

export type QuizAnalytics = {
  totalTaken: number;
  averageScore: number;
};

export type AnalyticsData = {
  overview: AnalyticsOverview;
  recentActivity: RecentActivity[];
  quizzes: QuizAnalytics;
};

export type AnalyticsResponse = {
  message?: string;
  overview: AnalyticsOverview;
  recentActivity: RecentActivity[];
  quizzes: QuizAnalytics;
};