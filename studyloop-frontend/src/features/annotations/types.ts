export type Annotation = {
  id: string;
  lessonId: string;
  topicId: string | null;
  userId: string;
  content: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnotationPayload = {
  content: string;
  topicId?: string;
  color?: string;
};

export type UpdateAnnotationPayload = {
  content?: string;
  color?: string;
};