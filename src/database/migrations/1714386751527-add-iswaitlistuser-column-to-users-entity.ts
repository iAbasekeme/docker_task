import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIswaitlistuserColumnToUsersEntity1714386751527 implements MigrationInterface {
    name = 'AddIswaitlistuserColumnToUsersEntity1714386751527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_waitlist_user" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_waitlist_user"`);
    }

}
