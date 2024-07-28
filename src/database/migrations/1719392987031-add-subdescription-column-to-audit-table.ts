import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubdescriptionColumnToAuditTable1719392987031 implements MigrationInterface {
    name = 'AddSubdescriptionColumnToAuditTable1719392987031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "sub_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "sub_description"`);
    }

}
