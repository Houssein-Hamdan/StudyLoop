import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary , SummaryDepth } from '../../../entities/summary.entity.js';
import { ISummaryRepository } from './summary.repository.interface.js';

@Injectable()
export class SummaryRepository implements ISummaryRepository {
  constructor(
    @InjectRepository(Summary)
    private readonly repository: Repository<Summary>,
  ) {}

  async findById(id: string): Promise<Summary | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByLessonId(lessonId: string): Promise<Summary[]> {
    return this.repository.find({
      where: { lessonId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByLessonIdAndDepth(
    lessonId: string,
    depth: SummaryDepth,
    selectedTopicIds?: string[],
  ): Promise<Summary | null> {
    const summaries = await this.repository.find({
      where: { lessonId, depth },
      order: { createdAt: 'DESC' },
    });

    const requestedIds = [...(selectedTopicIds ?? [])].sort();

    return (
      summaries.find((summary) => {
        const savedIds: string[] = summary.selectedTopicIds
          ? JSON.parse(summary.selectedTopicIds)
          : [];

        return (
          JSON.stringify([...savedIds].sort()) === JSON.stringify(requestedIds)
        );
      }) ?? null
    );
  }

  async create(summary: Partial<Summary>): Promise<Summary> {
    const newSummary = this.repository.create(summary);
    return this.repository.save(newSummary);
  }

  async update(id: string, summary: Partial<Summary>): Promise<Summary> {
    await this.repository.update(id, summary);
    const updated = await this.repository.findOne({ where: { id } });

    if (!updated) {
      throw new Error(`Summary with id ${id} not found after update`);
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
