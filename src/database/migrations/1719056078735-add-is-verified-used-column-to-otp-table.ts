import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsVerifiedUsedColumnToOtpTable1719056078735 implements MigrationInterface {
    name = 'AddIsVerifiedUsedColumnToOtpTable1719056078735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" ADD "is_verified_used" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otps" DROP COLUMN "is_verified_used"`);
    }

}
