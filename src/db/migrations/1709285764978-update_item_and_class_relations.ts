import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItemAndClassRelations1709285764978 implements MigrationInterface {
    name = 'UpdateItemAndClassRelations1709285764978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_553450849c0a039c073adef94e2"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "UQ_553450849c0a039c073adef94e2"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_553450849c0a039c073adef94e2" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_553450849c0a039c073adef94e2"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "UQ_553450849c0a039c073adef94e2" UNIQUE ("classId")`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_553450849c0a039c073adef94e2" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
