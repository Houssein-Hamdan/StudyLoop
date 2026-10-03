import { apiClient } from '../../lib/api/client';

import type {
  Annotation,
  CreateAnnotationPayload,
  UpdateAnnotationPayload,
} from './types';

export async function getLessonAnnotations(
  lessonId: string,
): Promise<Annotation[]> {
  const response = await apiClient.get(
    `/lessons/${lessonId}/annotations`,
  );

  return response.data;
}

export async function createAnnotation(
  lessonId: string,
  payload: CreateAnnotationPayload,
): Promise<Annotation> {
  const response = await apiClient.post(
    `/lessons/${lessonId}/annotations`,
    payload,
  );

  return response.data;
}

export async function updateAnnotation(
  lessonId: string,
  annotationId: string,
  payload: UpdateAnnotationPayload,
): Promise<Annotation> {
  const response = await apiClient.patch(
    `/lessons/${lessonId}/annotations/${annotationId}`,
    payload,
  );

  return response.data;
}

export async function deleteAnnotation(
  lessonId: string,
  annotationId: string,
) {
  const response = await apiClient.delete(
    `/lessons/${lessonId}/annotations/${annotationId}`,
  );

  return response.data;
}