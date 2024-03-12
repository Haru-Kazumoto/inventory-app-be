import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemTable1710139039113 implements MigrationInterface {
    name = 'UpdateItemTable1710139039113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "total_unit" character varying`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "category_item" character varying`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "total_exit_item" text DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "item_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "redeem_code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "generated_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "is_valid" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "is_valid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "generated_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "redeem_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "item_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "total_exit_item"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "category_item"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "total_unit"`);
    }

}
