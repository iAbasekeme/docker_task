import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditTable1719391523594 implements MigrationInterface {
    name = 'CreateAuditTable1719391523594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "operation_type" character varying NOT NULL, "subject_id" character varying NOT NULL, "subject_type" character varying NOT NULL, "description" character varying NOT NULL, "object_type" character varying NOT NULL, "object_id" character varying NOT NULL, "initial_object_state" json, "final_object_state" json, "action" character varying NOT NULL, "target_app" character varying NOT NULL, "source_app" character varying NOT NULL, "metadata" json, "level" character varying NOT NULL, "request_context" json, "target_id" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
