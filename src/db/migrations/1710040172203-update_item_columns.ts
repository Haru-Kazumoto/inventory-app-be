import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemColumns1710040172203 implements MigrationInterface {
    name = 'UpdateItemColumns1710040172203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "total_unit" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "total_unit"`);
    }

}
