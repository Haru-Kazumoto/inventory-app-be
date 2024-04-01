import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestItemTable1711695491272 implements MigrationInterface {
    name = 'UpdateRequestItemTable1711695491272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" ADD "item_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request_items" DROP COLUMN "item_type"`);
    }

}
