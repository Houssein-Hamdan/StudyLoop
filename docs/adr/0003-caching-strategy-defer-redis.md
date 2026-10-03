ADR 0003: Defer Distributed Caching (No Redis Initially)

Context
Modern applications often use distributed memory caches (like Redis) for session management, response caching, or rate limiting to boost query performance. We need to decide whether to introduce an external caching layer into the core stack.

Decision
We decide NOT to use a dedicated in-memory cache (like Redis) for the initial MVP release. Caching will rely on standard database indexing and framework-level in-memory/http caching if needed.

Justification
Avoid Unnecessary Complexity: Introducing Redis adds infrastructural overhead (cluster setup, network connection management, state synchronization) and operational cost.

Scope & Performance Realities: The initial dataset size and query load do not justify a separate caching tier. SQL query response times (with proper database indexing) will comfortably meet the performance requirement (< 2s load time).

Cost & Constraints: Hosting a persistent Redis instance often incurs additional hosting costs or consumes free-tier limitations unnecessarily.

YAGNI Principle (You Aren't Gonna Need It): Premature optimization should be avoided. Redis can easily be introduced later when actual performance bottlenecks occur under high traffic.

Consequences
Positive: Simpler infrastructure stack, faster deployment pipelines, zero additional hosting costs, and reduced bug surface area (no cache invalidation bugs).

Negative: High-frequency repeated queries will hit the primary SQL database directly.