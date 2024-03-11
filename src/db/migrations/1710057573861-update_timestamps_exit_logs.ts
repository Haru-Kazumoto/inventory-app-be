import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimestampsExitLogs1710057573861 implements MigrationInterface {
    name = 'UpdateTimestampsExitLogs1710057573861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "created_at"`);
    }

}
