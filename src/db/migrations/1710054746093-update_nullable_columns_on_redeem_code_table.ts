import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNullableColumnsOnRedeemCodeTable1710054746093 implements MigrationInterface {
    name = 'UpdateNullableColumnsOnRedeemCodeTable1710054746093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "generated_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "is_valid" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "is_valid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ALTER COLUMN "generated_date" SET NOT NULL`);
    }

}
