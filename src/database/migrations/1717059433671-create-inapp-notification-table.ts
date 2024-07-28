import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInappNotificationTable1717059433671 implements MigrationInterface {
    name = 'CreateInappNotificationTable1717059433671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "in_app_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notification_id" uuid NOT NULL, "user_id" uuid NOT NULL, "outbound_notification_id" uuid, "readAt" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_86b959a30c3931ec8ff167c4f7" UNIQUE ("outbound_notification_id"), CONSTRAINT "PK_f871e2a23724692bbb5b3b75c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD CONSTRAINT "FK_86b959a30c3931ec8ff167c4f7e" FOREIGN KEY ("outbound_notification_id") REFERENCES "outbound_notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD CONSTRAINT "FK_1aae9fb865688e0f0b3bfa564f7" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" ADD CONSTRAINT "FK_095076c892fd4f640ea401d83ab" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP CONSTRAINT "FK_095076c892fd4f640ea401d83ab"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP CONSTRAINT "FK_1aae9fb865688e0f0b3bfa564f7"`);
        await queryRunner.query(`ALTER TABLE "in_app_notifications" DROP CONSTRAINT "FK_86b959a30c3931ec8ff167c4f7e"`);
        await queryRunner.query(`DROP TABLE "in_app_notifications"`);
    }

}
