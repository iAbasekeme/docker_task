import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsverifiedToOtpTabele1713787882519 implements MigrationInterface {
    name = 'AddIsverifiedToOtpTabele1713787882519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "is_verified"`);
    }

}
