export type SearchLessonStatus =
  | 'in_progress'
  | 'mastered'
  | 'all';

export type SearchLessonSort =
  | 'newest'
  | 'oldest'
  | 'most_completed';

export type SearchLessonParams = {
  query?: string;
  status?: SearchLessonStatus;
  sortBy?: SearchLessonSort;
  skip?: number;
  take?: number;
};

export type SearchLesson = {
  id: string;
  title: string;
  containerId?: string;
  container?: {
    id: string;
    name?: string;
  };
  createdAt: string;
  updatedAt: string;

  totalTopics?: number;
  completedTopics?: number;
  completionPercentage?: number;
};

export type SearchLessonsResponse = {
  message?: string;
  count?: number;
  lessons: SearchLesson[];
};