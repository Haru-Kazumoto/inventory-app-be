import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateTableSchema1709741939360 implements MigrationInterface {
    name = 'GenerateTableSchema1709741939360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "class_name" character varying NOT NULL, "major" character varying NOT NULL, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "item_code" character varying NOT NULL, "status_item" character varying NOT NULL DEFAULT 'TERSEDIA', "source_fund" character varying, "unit_price" integer NOT NULL DEFAULT '0', "total_unit_price" integer, "category_item" character varying NOT NULL, "class_id" integer NOT NULL, "total_current_item" integer NOT NULL DEFAULT '0', "item_type" character varying NOT NULL DEFAULT 'NON ATK', "classId" integer, CONSTRAINT "UQ_e2ea00bf2ee99ee2eec0d711574" UNIQUE ("item_code"), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "edited_by" integer NOT NULL, "edited_at" TIMESTAMP NOT NULL, "edit_method" character varying NOT NULL, "item_id" integer NOT NULL, "itemId" integer, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "destroyedAt" TIMESTAMP, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c1989542e47d9e3b98fe32c67" ON "sessions" ("expiredAt") `);
        await queryRunner.query(`CREATE TABLE "item_details" ("id" SERIAL NOT NULL, "item_id" integer NOT NULL, "exit_log_id" integer, CONSTRAINT "PK_5454cdc4a554db3678109d12533" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "redeem_code" ("id" SERIAL NOT NULL, "redeem_code" character varying(5) NOT NULL, "generated_date" TIMESTAMP NOT NULL, "is_valid" boolean NOT NULL DEFAULT true, "destroyed_date" TIMESTAMP, "log_id" integer NOT NULL, "exitLogId" integer, CONSTRAINT "UQ_ffbe7215c9e68c4cc828cdf6083" UNIQUE ("redeem_code"), CONSTRAINT "REL_a3c14218b397b4460fe73688c4" UNIQUE ("exitLogId"), CONSTRAINT "PK_59f77ecc8d36e06351d84313c93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exit_logs" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "major_class" character varying NOT NULL, "item_category" character varying NOT NULL DEFAULT 'Barang Habis Pakai', "status_exit" character varying NOT NULL, "redeemCodeId" integer, CONSTRAINT "REL_095d77fb5c0604b0dffde283c7" UNIQUE ("redeemCodeId"), CONSTRAINT "PK_6d627a026f50b36a110afac0c9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role_id" integer NOT NULL, "roleId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "major" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "date_send" TIMESTAMP NOT NULL, "color" character varying, "hasRead" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, "toSuperadmin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_553450849c0a039c073adef94e2" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_a014f735583d9f46af38766d2ca" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_details" ADD CONSTRAINT "FK_d51c782436629ba74d4437d7a18" FOREIGN KEY ("exit_log_id") REFERENCES "exit_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redeem_code" ADD CONSTRAINT "FK_a3c14218b397b4460fe73688c4c" FOREIGN KEY ("exitLogId") REFERENCES "exit_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exit_logs" ADD CONSTRAINT "FK_095d77fb5c0604b0dffde283c74" FOREIGN KEY ("redeemCodeId") REFERENCES "redeem_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "exit_logs" DROP CONSTRAINT "FK_095d77fb5c0604b0dffde283c74"`);
        await queryRunner.query(`ALTER TABLE "redeem_code" DROP CONSTRAINT "FK_a3c14218b397b4460fe73688c4c"`);
        await queryRunner.query(`ALTER TABLE "item_details" DROP CONSTRAINT "FK_d51c782436629ba74d4437d7a18"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_a014f735583d9f46af38766d2ca"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_553450849c0a039c073adef94e2"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "exit_logs"`);
        await queryRunner.query(`DROP TABLE "redeem_code"`);
        await queryRunner.query(`DROP TABLE "item_details"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c1989542e47d9e3b98fe32c67"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "class"`);
    }

}
