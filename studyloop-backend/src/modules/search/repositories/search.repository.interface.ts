import type { Lesson } from '../../../entities/lesson.entity.js';
import type { Topic } from '../../../entities/topic.entity.js';
import type { SearchLessonDto } from '../dto/search-lesson.dto.js';
import type { SearchTopicDto } from '../dto/search-topic.dto.js';

export const SEARCH_REPOSITORY = Symbol('SEARCH_REPOSITORY');


export interface ISearchRepository {
  searchLessonsByContainer(
    userId: string,
    containerId: string,
    filters: SearchLessonDto,
  ): Promise<{ lessons: Lesson[]; total: number }>;

  searchLessonsAcrossContainers(
    userId: string,
    filters: SearchLessonDto,
  ): Promise<{ lessons: Lesson[]; total: number }>;

  searchTopicsInLesson(
    userId: string,
    lessonId: string,
    filters: SearchTopicDto,
  ): Promise<{ topics: Topic[]; total: number }>;

  searchTopicsAcrossLessons(
    userId: string,
    containerId: string,
    filters: SearchTopicDto,
  ): Promise<{ topics: Topic[]; total: number }>;
}