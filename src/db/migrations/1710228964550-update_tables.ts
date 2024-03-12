import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1710228964550 implements MigrationInterface {
    name = 'UpdateTables1710228964550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "accepted_date"`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "accepted_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "accepted_date"`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "accepted_date" integer`);
    }

}
