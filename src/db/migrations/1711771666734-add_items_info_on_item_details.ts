import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemsInfoOnItemDetails1711771666734 implements MigrationInterface {
    name = 'AddItemsInfoOnItemDetails1711771666734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" ADD "item_name" character varying`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD "item_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "item_code"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP COLUMN "item_name"`);
    }

}
