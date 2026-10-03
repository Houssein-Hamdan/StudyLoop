import type { Lesson } from '../types';
import { LessonCard } from './LessonCard';

type LessonListProps = {
  lessons: Lesson[];
  containerId: string;
};

export function LessonList({
  lessons,
  containerId,
}: LessonListProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          containerId={containerId}
        />
      ))}
    </div>
  );
}