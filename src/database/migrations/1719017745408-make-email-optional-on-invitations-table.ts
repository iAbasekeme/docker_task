import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeEmailOptionalOnInvitationsTable1719017745408 implements MigrationInterface {
    name = 'MakeEmailOptionalOnInvitationsTable1719017745408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" ALTER COLUMN "email" SET NOT NULL`);
    }

}
