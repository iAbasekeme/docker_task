import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatesToRoomCategoriesAmenitiesHotelCoordinatesTables1715915989217 implements MigrationInterface {
    name = 'UpdatesToRoomCategoriesAmenitiesHotelCoordinatesTables1715915989217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_categories" ADD "cost_amount" integer`);
        await queryRunner.query(`ALTER TABLE "room_categories" ADD "cost_currency" character varying DEFAULT 'NGN'`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "coordinates" geography(Point,4326)`);
        await queryRunner.query(`ALTER TABLE "room_amenities" ADD CONSTRAINT "UQ_054d40180b8ca13fda032de8d25" UNIQUE ("name", "hotel_id", "room_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_amenities" DROP CONSTRAINT "UQ_054d40180b8ca13fda032de8d25"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "room_categories" DROP COLUMN "cost_currency"`);
        await queryRunner.query(`ALTER TABLE "room_categories" DROP COLUMN "cost_amount"`);
    }

}
