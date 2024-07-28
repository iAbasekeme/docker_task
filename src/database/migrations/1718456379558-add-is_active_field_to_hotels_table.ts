import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveFieldToHotelsTable1718456379558 implements MigrationInterface {
    name = 'AddIsActiveFieldToHotelsTable1718456379558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "is_active"`);
    }

}
