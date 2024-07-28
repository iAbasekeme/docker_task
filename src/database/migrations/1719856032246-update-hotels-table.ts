import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHotelsTable1719856032246 implements MigrationInterface {
    name = 'UpdateHotelsTable1719856032246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "is_location_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "is_location_verified"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "state"`);
    }

}
