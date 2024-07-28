import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddPersonIdToInappNotificationsTable1719391879963 implements MigrationInterface {
    name = 'AddAddPersonIdToInappNotificationsTable1719391879963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP CONSTRAINT "FK_095076c892fd4f640ea401d83ab"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD "person_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD "person_type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP COLUMN "person_type"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP COLUMN "person_id"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD CONSTRAINT "FK_095076c892fd4f640ea401d83ab" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
