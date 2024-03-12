import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemTableColumn1710142767998 implements MigrationInterface {
    name = 'UpdateItemTableColumn1710142767998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "item_condition" SET DEFAULT 'BAIK'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "item_condition" DROP DEFAULT`);
    }

}
