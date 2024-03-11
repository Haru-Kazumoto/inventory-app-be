import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemDetailsColumn1709994648141 implements MigrationInterface {
    name = 'UpdateItemDetailsColumn1709994648141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" ADD "category_item" character varying`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "total_exit_item" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "total_exit_item"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "category_item"`);
    }

}
