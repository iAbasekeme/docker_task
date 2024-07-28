import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveFieldToHotelStaffEntity1713539970452 implements MigrationInterface {
    name = 'AddIsActiveFieldToHotelStaffEntity1713539970452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP COLUMN "is_active"`);
    }

}
