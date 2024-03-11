import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateValueTables1710060045087 implements MigrationInterface {
    name = 'UpdateValueTables1710060045087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item_details" ("id" SERIAL NOT NULL, "item_id" integer NOT NULL, "category_item" character varying, "total_exit_item" text DEFAULT '0', "exit_log_id" integer, CONSTRAINT "PK_5454cdc4a554db3678109d12533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "redeem_code" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "redeem_code" character varying(5), "generated_date" TIMESTAMP, "is_valid" boolean DEFAULT true, "destroyed_date" TIMESTAMP, "log_id" integer NOT NULL, "exitLogId" integer, CONSTRAINT "UQ_ffbe7215c9e68c4cc828cdf6083" UNIQUE ("redeem_code"), CONSTRAINT "REL_a3c14218b397b4460fe73688c4" UNIQUE ("exitLogId"), CONSTRAINT "PK_59f77ecc8d36e06351d84313c93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exit_logs" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "major_class" character varying NOT NULL, "item_category" character varying NOT NULL DEFAULT 'Barang Habis Pakai', "status_exit" character varying NOT NULL, "redeemCodeId" integer, CONSTRAINT "REL_095d77fb5c0604b0dffde283c7" UNIQUE ("redeemCodeId"), CONSTRAINT "PK_6d627a026f50b36a110afac0c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD CONSTRAINT "FK_d51c782436629ba74d4437d7a18" FOREIGN KEY ("exit_log_id") REFERENCES "exit_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ADD CONSTRAINT "FK_a3c14218b397b4460fe73688c4c" FOREIGN KEY ("exitLogId") REFERENCES "exit_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD CONSTRAINT "FK_095d77fb5c0604b0dffde283c74" FOREIGN KEY ("redeemCodeId") REFERENCES "redeem_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP CONSTRAINT "FK_095d77fb5c0604b0dffde283c74"`);
        await queryRunner.query(`ALTER TABLE "redeem_code" DROP CONSTRAINT "FK_a3c14218b397b4460fe73688c4c"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP CONSTRAINT "FK_d51c782436629ba74d4437d7a18"`);
        await queryRunner.query(`DROP TABLE "exit_logs"`);
        await queryRunner.query(`DROP TABLE "redeem_code"`);
        await queryRunner.query(`DROP TABLE "item_details"`);
    }

}
