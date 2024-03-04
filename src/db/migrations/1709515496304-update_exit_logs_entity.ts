import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExitLogsEntity1709515496304 implements MigrationInterface {
    name = 'UpdateExitLogsEntity1709515496304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" RENAME COLUMN "item_detail_id" TO "total"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ALTER COLUMN "total" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" ALTER COLUMN "total" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "exit_logs" RENAME COLUMN "total" TO "item_detail_id"`);
    }

}
