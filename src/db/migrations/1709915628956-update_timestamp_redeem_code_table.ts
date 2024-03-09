import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimestampRedeemCodeTable1709915628956 implements MigrationInterface {
    name = 'UpdateTimestampRedeemCodeTable1709915628956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_code" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_code" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "redeem_code" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "redeem_code" DROP COLUMN "created_at"`);
    }

}
