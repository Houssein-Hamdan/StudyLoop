Problem
Learners often forget information they have previously studied because they do not have a structured way to store, review, and reinforce what they have learned.
There is a need for a simple platform that helps learners:
    • Store what they have learned in an organized way.
    • Review lessons regularly.
    • Track their learning and review progress.
    • Summarize what they have learned.
    • Test their knowledge through quizzes.
    • Easily access their learning materials from different devices.
    • Ask questions about information they have forgotten.
    • Share lessons and learning progress with friends.
Target User
A learner who wants to store, review, and retain what they are learning over time.



Functional Requirements
The system should allow users to:
    1. Authentication
        ○ Register an account.
        ○ Log in and log out.
    2. Learning Content
        ○ Add and save lessons.
        ○ Organize lessons into containers/categories.
        ○ Edit and delete saved lessons.
        ○ View previously saved lessons.
    3. Review
        ○ Review saved lessons easily.
        ○ Track which lessons have been reviewed.
        ○ Track learning and review progress.
        ○ Know what needs to be reviewed.
    4. Summarization
        ○ Generate or create a summary of a lesson.
        ○ Review the summary instead of going through the entire lesson when appropriate.
    5. Quizzes
        ○ Generate or take quizzes based on learned material.
        ○ Answer questions and receive results.
        ○ Use quizzes to reinforce previously learned information.
    6. Questions
        ○ Ask questions about a lesson or a specific idea.
        ○ Get help understanding or remembering forgotten information.
    7. Sharing
        ○ Share lessons with friends.
        ○ Share learning progress with friends.
        ○ Control whether shared content is accessible to others.
    8. Progress
        ○ Save the user's learning and review progress.
        ○ Resume learning from where the user previously stopped.



Non-Functional Requirements
Availability
The system should be available whenever users want to access their learning materials and review their progress.
Usability
    • Users should be able to quickly access their lessons.
    • Adding and editing learning materials should be simple.
    • Reviewing lessons should require minimal effort.
    • The interface should be easy to understand without extensive instructions.
Performance
    • Lessons and saved content should load quickly.
    • Users should be able to add, edit, delete, and review content without noticeable delays.
    • Quiz generation and submission should provide a reasonable response time.
    • Progress updates should be saved reliably.
Security
    • Users must only be able to access their own private learning materials.
    • Users must not be able to access another user's private data.
    • Authentication and authorization must be enforced.
    • Shared content should only be accessible according to the owner's sharing permissions.
Data Integrity
    • User learning materials and progress should not be accidentally lost or corrupted.
    • Important operations should be performed reliably and consistently.
Responsiveness
    • The application should be usable on desktop and mobile devices.



Constraints
    • Team: 1 developer
    • Budget: $0
    • Development Time: Maximum 3 weeks
    • Initial Target: Small number of users
    • Infrastructure: Use free or low-cost services where possible
    • Scope: Focus on the core learning and review experience; advanced features should be postponed unless they are essential.



Risks
1. Data Loss
A database failure or accidental deletion could cause users to lose their saved lessons and learning progress.
Mitigation:
    • Use reliable database constraints and transactions.
    • Use backups where possible.
2. Scope Creep
The project may become too large to complete within the 3-week deadline.
Mitigation:
    • Define a strict MVP.
    • Postpone non-essential features.
3. AI/API Dependency
AI-powered summaries, quizzes, or questions may depend on an external API that can become unavailable, slow, or exceed free usage limits.
Mitigation:
    • Isolate AI functionality behind a dedicated service.
    • Handle API failures gracefully.
4. Unauthorized Access
A user may attempt to access another user's private lessons, progress, or other protected data.
Mitigation:
    • Enforce authentication and authorization.
    • Perform ownership checks on protected resources.



User Flow:
Login 
 ↓
Add lesson
 ↓ 
Summary
 ↓ 
Quiz
 ↓ 
Review
 ↓ 
Ask
 ↓ 
Share
