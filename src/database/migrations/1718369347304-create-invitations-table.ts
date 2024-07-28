import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInvitationsTable1718369347304 implements MigrationInterface {
    name = 'CreateInvitationsTable1718369347304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "used_at" TIMESTAMP, "expires_at" TIMESTAMP NOT NULL, "invite_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a6e36c7a63ac730cddddc3bbaf" UNIQUE ("invite_id"), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "invitations"`);
    }

}
