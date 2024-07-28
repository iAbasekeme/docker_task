import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeAgentReferenceIdFieldUniqueAndNotNullable1717765661801 implements MigrationInterface {
    name = 'MakeAgentReferenceIdFieldUniqueAndNotNullable1717765661801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketing_agents" ADD CONSTRAINT "UQ_2d905ee57011b5b0545e8535a16" UNIQUE ("reference_id")`);
        await queryRunner.query(`ALTER TABLE "marketing_agents" ALTER COLUMN "reference_id" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "marketing_agents" ALTER COLUMN "reference_id" SET DEFAULT 'cc95d277-570d-4bf5-b83e-72c40d98633b'`);
        await queryRunner.query(`ALTER TABLE "marketing_agents" DROP CONSTRAINT "UQ_2d905ee57011b5b0545e8535a16"`);
    }

}
