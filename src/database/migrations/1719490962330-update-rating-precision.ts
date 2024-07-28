import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRatingPrecision1719490962330 implements MigrationInterface {
    name = 'UpdateRatingPrecision1719490962330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "average_rating" TYPE numeric(3,2)`);
        await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "average_rating" TYPE numeric(3,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ALTER COLUMN "average_rating" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "average_rating" TYPE numeric(10,2)`);
    }

}
