import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAverageRatingToDecimalType1719488637916 implements MigrationInterface {
    name = 'ChangeAverageRatingToDecimalType1719488637916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "average_rating" numeric(10,2) NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "average_rating" numeric(10,2) NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "average_rating" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "average_rating"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "average_rating" integer NOT NULL DEFAULT '5'`);
    }

}
