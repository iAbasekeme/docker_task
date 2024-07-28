import { MigrationInterface, QueryRunner } from "typeorm";

export class EnableSoftDeleteOnHotels1718286144339 implements MigrationInterface {
    name = 'EnableSoftDeleteOnHotels1718286144339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "deleted_at"`);
    }

}
