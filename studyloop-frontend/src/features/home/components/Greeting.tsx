type GreetingProps = {
  name: string;
};

export function Greeting({ name }: GreetingProps) {
  return (
    <section>
      <p className="text-sm font-medium text-[var(--primary)]">
        Welcome back
      </p>

      <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        Good evening, {name} 👋
      </h2>

      <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">
        Continue where you left off and keep your learning loop moving.
      </p>
    </section>
  );
}