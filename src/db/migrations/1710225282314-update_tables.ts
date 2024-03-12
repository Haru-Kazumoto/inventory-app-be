import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTables1710225282314 implements MigrationInterface {
    name = 'UpdateTables1710225282314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "request_items" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "created_at"`);
    }

}
