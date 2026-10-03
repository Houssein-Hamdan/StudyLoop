import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1791047750046 implements MigrationInterface {
    name = 'InitialDatabase1791047750046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "containerId" uuid NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "shareToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6e11b6783b69c63f1df73a0a2a" UNIQUE ("shareToken"), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "lessonId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "annotations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "color" character varying, "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "topicId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d5b59b40ef7ee54b4309c2e89b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "containers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21cbac3e68f7b1cf53d39cda70c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "completedTopicsCount" integer NOT NULL DEFAULT '0', "totalTopicsCount" integer NOT NULL DEFAULT '0', "completionPercentage" integer NOT NULL DEFAULT '0', "scrollPosition" integer NOT NULL DEFAULT '0', "isLessonCompleted" boolean NOT NULL DEFAULT false, "lastReviewedAt" TIMESTAMP, "nextReviewDate" TIMESTAMP, "reviewCount" integer NOT NULL DEFAULT '0', "reviewIntervalDays" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_26319ff74c8120c7b08842013f7" UNIQUE ("userId", "lessonId"), CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "answerText" text NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "aiProvider" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5257525a7773e5159714a3eb13c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "questionText" text NOT NULL, "topicId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "questionId" uuid NOT NULL, "userAnswer" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3fefbc8a840a41b6a15a4f9ca5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."quizzes_scope_enum" AS ENUM('full_lesson', 'selected_topics', 'random')`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lessonId" uuid NOT NULL, "scope" "public"."quizzes_scope_enum" NOT NULL, "selectedTopicIds" text, "difficulty" character varying NOT NULL, "format" character varying NOT NULL, "questionCount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quizId" uuid NOT NULL, "questionText" character varying NOT NULL, "optionsJson" text, "correctAnswer" character varying, "format" character varying NOT NULL, "order" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec0447fd30d9f5c182e7653bfd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."summaries_depth_enum" AS ENUM('short', 'medium', 'detailed')`);
        await queryRunner.query(`CREATE TABLE "summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lessonId" uuid NOT NULL, "content" text NOT NULL, "depth" "public"."summaries_depth_enum" NOT NULL, "selectedTopicIds" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_448e2a87db98ce2a6ee8946f392" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_topic_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "topicId" uuid NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1af87da88e1973ca35f936d594f" UNIQUE ("userId", "topicId"), CONSTRAINT "PK_bd04b1cdf363a1ac5cead8de7ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_136cb2a0c78abce1cf9bfc18157" FOREIGN KEY ("containerId") REFERENCES "containers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topics" ADD CONSTRAINT "FK_3574fed7c0177a11b93c8ff71d5" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "annotations" ADD CONSTRAINT "FK_555aa1da91c3859054fbf8bc400" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "annotations" ADD CONSTRAINT "FK_73a201a0bf3d23ffa4a398e7a89" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "annotations" ADD CONSTRAINT "FK_7d61d838e983c522cb75443e958" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "containers" ADD CONSTRAINT "FK_f3827539132d937035ff5a2776b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_df6c728a3df388df34e03d08088" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question_answers" ADD CONSTRAINT "FK_cc2642c5e8deced1208e60ce950" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_bc2370231ea3e3d296963f33939" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_5ff5c21d36d6ad6083aa129d632" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" ADD CONSTRAINT "FK_731183677d09e50f6b22fe39840" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" ADD CONSTRAINT "FK_78f9544421d6fd1dfa11b1f5f37" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_eba9ff0775c843581aab6916b32" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ADD CONSTRAINT "FK_8889ccc5a40989ea308a588870e" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summaries" ADD CONSTRAINT "FK_4630d28d1b6227a2074ff439ceb" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" ADD CONSTRAINT "FK_f6b8a4b2da38741b6d3e45bb9b5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" ADD CONSTRAINT "FK_137c442b00194e02afe84998b68" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_topic_progress" DROP CONSTRAINT "FK_137c442b00194e02afe84998b68"`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" DROP CONSTRAINT "FK_f6b8a4b2da38741b6d3e45bb9b5"`);
        await queryRunner.query(`ALTER TABLE "summaries" DROP CONSTRAINT "FK_4630d28d1b6227a2074ff439ceb"`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" DROP CONSTRAINT "FK_8889ccc5a40989ea308a588870e"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_eba9ff0775c843581aab6916b32"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" DROP CONSTRAINT "FK_78f9544421d6fd1dfa11b1f5f37"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers" DROP CONSTRAINT "FK_731183677d09e50f6b22fe39840"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_5ff5c21d36d6ad6083aa129d632"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_bc2370231ea3e3d296963f33939"`);
        await queryRunner.query(`ALTER TABLE "question_answers" DROP CONSTRAINT "FK_cc2642c5e8deced1208e60ce950"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`);
        await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_f3827539132d937035ff5a2776b"`);
        await queryRunner.query(`ALTER TABLE "annotations" DROP CONSTRAINT "FK_7d61d838e983c522cb75443e958"`);
        await queryRunner.query(`ALTER TABLE "annotations" DROP CONSTRAINT "FK_73a201a0bf3d23ffa4a398e7a89"`);
        await queryRunner.query(`ALTER TABLE "annotations" DROP CONSTRAINT "FK_555aa1da91c3859054fbf8bc400"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP CONSTRAINT "FK_3574fed7c0177a11b93c8ff71d5"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_136cb2a0c78abce1cf9bfc18157"`);
        await queryRunner.query(`DROP TABLE "user_topic_progress"`);
        await queryRunner.query(`DROP TABLE "summaries"`);
        await queryRunner.query(`DROP TYPE "public"."summaries_depth_enum"`);
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TYPE "public"."quizzes_scope_enum"`);
        await queryRunner.query(`DROP TABLE "quiz_answers"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "question_answers"`);
        await queryRunner.query(`DROP TABLE "progress"`);
        await queryRunner.query(`DROP TABLE "containers"`);
        await queryRunner.query(`DROP TABLE "annotations"`);
        await queryRunner.query(`DROP TABLE "topics"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
