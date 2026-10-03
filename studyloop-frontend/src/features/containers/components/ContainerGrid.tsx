import type { Container } from '../types';
import { ContainerCard } from './ContainerCard';

type ContainerGridProps = {
  containers: Container[];
};

export function ContainerGrid({
  containers,
}: ContainerGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {containers.map((container) => (
        <ContainerCard
          key={container.id}
          container={container}
        />
      ))}
    </div>
  );
}