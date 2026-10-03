ADR 0001: Choose Modular Monolith Architecture

Context
We need to design the system architecture for a learning content and review platform. The application includes multiple features such as Authentication, Content Management, Review Engine, Summarization, Quizzes, Questions, Sharing, and Progress Tracking. We need an architecture that ensures fast development speed, maintainability, and clean separation of concerns while keeping operational complexity low.

Decision
We decide to adopt a Modular Monolith architecture.

Instead of building a Microservices architecture or a tightly coupled Monolith, the system will be built as a single deployable application structured into distinct, highly encapsulated domain modules (e.g., AuthModule, LessonModule, QuizModule, AIModule, SharingModule).

Justification
Project Constraints: The project is built by a solo developer within a strict 3-week timeline and a $0 budget constraint. Microservices would introduce extreme overhead in setup, continuous integration, cross-service communication, distributed tracing, and hosting infrastructure.

Low Initial User Load: Given the initial scope and small target user base, distributed scalability is not an immediate necessity.

Maintainability & Modularity: A Modular Monolith allows us to maintain clear boundaries between domains, clean domain-driven code, and low coupling.

Future-Proof Scalability: If a specific domain (such as the AI Summarization/Quiz Engine) faces high resource demand in the future, it can easily be extracted into an independent microservice with minimal refactoring.

Single Deployment Unit: Deployment, local development, logging, and debugging remain unified and frictionless.

Consequences
Positive: Fast development velocity, single database transactions, low infrastructure costs, easy deployment, and clear domain organization.

Negative: Requires team discipline to enforce module boundaries and prevent direct cross-module coupling or leaks.