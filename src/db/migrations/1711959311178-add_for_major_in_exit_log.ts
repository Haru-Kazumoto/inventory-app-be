import { MigrationInterface, QueryRunner } from "typeorm";

export class AddForMajorInExitLog1711959311178 implements MigrationInterface {
    name = 'AddForMajorInExitLog1711959311178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "for_major" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "for_major"`);
    }

}
