ADR 0002: Choose Relational Database (SQL)

Context
The application requires storing structured domain entities including Users, Lessons, Categories/Containers, Quizzes, Progress Records, and Shared Access Rights. We need to select an appropriate database paradigm (Relational SQL vs. Non-Relational NoSQL).

Decision
We decide to use a Relational SQL Database (e.g., PostgreSQL).

Justification
Strong Relational Data Model: The core domain entities are inherently relational with explicit linkages (e.g., One User owns Many Lessons, Lessons belong to Containers, Lessons link to Quizzes and Progress tracking).

Data Integrity & Consistency: Critical operations like updating progress and managing shared access require strong ACID compliance and foreign key constraints to prevent orphaned data or accidental corruption.

No Advantage for NoSQL: The schema is highly structured and predictable. A document store (NoSQL) offers no structural or performance advantage for this specific domain model and could lead to complex data duplication/denormalization management.

Developer Expertise: The developer has strong existing domain expertise in SQL databases, reducing risk, bug rates, and development time.

Consequences
Positive: Strict data integrity, simple relational queries (JOINs), reliable transactions, and structured migrations.

Negative: Schema alterations require formal migration scripts during development iterations.