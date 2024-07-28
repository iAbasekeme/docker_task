import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIsverifiedFieldFromHotel1720021076511 implements MigrationInterface {
    name = 'RemoveIsverifiedFieldFromHotel1720021076511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "is_verified"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

}
