import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHotelAndHotelStaffTable1714140091539 implements MigrationInterface {
    name = 'UpdateHotelAndHotelStaffTable1714140091539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "phone_numbers_intl" json`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "is_email_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "affiliate_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "affiliate_token"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "is_email_verified"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "phone_numbers_intl"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD "email" character varying NOT NULL`);
    }

}
