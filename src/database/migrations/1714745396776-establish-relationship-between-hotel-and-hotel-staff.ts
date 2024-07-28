import { MigrationInterface, QueryRunner } from "typeorm";

export class EstablishRelationshipBetweenHotelAndHotelStaff1714745396776 implements MigrationInterface {
    name = 'EstablishRelationshipBetweenHotelAndHotelStaff1714745396776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_28ea7646455f6426313a02b8af7"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP COLUMN "hotel_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD "hotel_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_b5fee77eaa22231307f47bc6954" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_b5fee77eaa22231307f47bc6954"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP COLUMN "hotel_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD "hotel_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_28ea7646455f6426313a02b8af7" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
