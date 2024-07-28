import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferenceIdToAgentsTable1717764987957 implements MigrationInterface {
    name = 'AddReferenceIdToAgentsTable1717764987957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketing_agents" ADD "reference_id" character varying NOT NULL DEFAULT 'cc95d277-570d-4bf5-b83e-72c40d98633b'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketing_agents" DROP COLUMN "reference_id"`);
    }

}
