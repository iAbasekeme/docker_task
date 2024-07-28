import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApprovedAtFieldToHotelsTable1718023243377 implements MigrationInterface {
    name = 'AddApprovedAtFieldToHotelsTable1718023243377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "approved_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "approved_at"`);
    }

}
