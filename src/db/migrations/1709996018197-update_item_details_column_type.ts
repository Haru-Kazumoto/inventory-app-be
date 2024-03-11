import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemDetailsColumnType1709996018197 implements MigrationInterface {
    name = 'UpdateItemDetailsColumnType1709996018197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "total_exit_item"`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "total_exit_item" text DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "total_exit_item"`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "total_exit_item" integer DEFAULT '0'`);
    }

}
