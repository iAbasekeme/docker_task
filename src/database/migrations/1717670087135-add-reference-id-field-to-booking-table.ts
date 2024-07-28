import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferenceIdFieldToBookingTable1717670087135 implements MigrationInterface {
    name = 'AddReferenceIdFieldToBookingTable1717670087135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD "reference_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP COLUMN "reference_id"`);
    }

}
