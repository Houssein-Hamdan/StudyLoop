import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790436817530 implements MigrationInterface {
    name = 'InitialSchema1790436817530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_topic_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "topicId" uuid NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1af87da88e1973ca35f936d594f" UNIQUE ("userId", "topicId"), CONSTRAINT "PK_bd04b1cdf363a1ac5cead8de7ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "scrollPosition"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "isCompleted"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "UQ_26319ff74c8120c7b08842013f7" UNIQUE ("userId", "lessonId")`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" ADD CONSTRAINT "FK_f6b8a4b2da38741b6d3e45bb9b5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" ADD CONSTRAINT "FK_137c442b00194e02afe84998b68" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_topic_progress" DROP CONSTRAINT "FK_137c442b00194e02afe84998b68"`);
        await queryRunner.query(`ALTER TABLE "user_topic_progress" DROP CONSTRAINT "FK_f6b8a4b2da38741b6d3e45bb9b5"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "UQ_26319ff74c8120c7b08842013f7"`);
        await queryRunner.query(`ALTER TABLE "topics" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "topics" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "scrollPosition" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "user_topic_progress"`);
    }

}
