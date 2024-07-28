import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRatingToHotelsAndRooms1718792509275 implements MigrationInterface {
    name = 'AddRatingToHotelsAndRooms1718792509275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "total_rating" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "rating_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "total_rating" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "rating_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "rating_count"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "total_rating"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "rating_count"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "total_rating"`);
    }

}
