import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserIdFieldFromAffiliateCodesTable1715689439336 implements MigrationInterface {
    name = 'RemoveUserIdFieldFromAffiliateCodesTable1715689439336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "user_id" character varying NOT NULL`);
    }

}
