import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminInvitationsTable1718290838323 implements MigrationInterface {
    name = 'AddAdminInvitationsTable1718290838323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "used_at" TIMESTAMP, "expires_at" TIMESTAMP NOT NULL, "invite_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_923fe109435a8a707ba4f3564a1" UNIQUE ("invite_id"), CONSTRAINT "PK_0c710b9106ea89847bcf62bd3e1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin_invitations"`);
    }

}
