import { UserTopicProgress
    
 } from "../../../entities/user-topic-progress.entity.js";
export const USER_TOPIC_PROGRESS_REPOSITORY = Symbol(
  'USER_TOPIC_PROGRESS_REPOSITORY',
);

export interface IUserTopicProgressRepository {
  findByUserAndTopic(
    userId: string,
    topicId: string,
  ): Promise<UserTopicProgress | null>;

  findByUserAndLesson(
    userId: string,
    lessonId: string,
  ): Promise<UserTopicProgress[]>;

  create(
    data: Partial<UserTopicProgress>,
  ): Promise<UserTopicProgress>;

  update(
    id: string,
    data: Partial<UserTopicProgress>,
  ): Promise<UserTopicProgress>;

  delete(id: string): Promise<boolean>;
}