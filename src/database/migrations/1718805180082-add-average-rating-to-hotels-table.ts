import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAverageRatingToHotelsTable1718805180082 implements MigrationInterface {
    name = 'AddAverageRatingToHotelsTable1718805180082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "average_rating" integer NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "average_rating"`);
    }

}
