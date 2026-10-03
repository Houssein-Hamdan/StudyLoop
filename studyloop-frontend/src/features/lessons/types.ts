export type Topic = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  title: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
};

export type CreateLessonMode = "structured" | "paste";

export type CreateLessonTopic = {
  title: string;
  description: string;
};

export type CreateLessonFormData = {
  title: string;
  description: string;
  topics: CreateLessonTopic[];
  rawContent: string;
};
