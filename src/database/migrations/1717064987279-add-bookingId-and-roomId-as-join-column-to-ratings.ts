import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingIdAndRoomIdAsJoinColumnToRatings1717064987279 implements MigrationInterface {
    name = 'AddBookingIdAndRoomIdAsJoinColumnToRatings1717064987279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_2743e4a018e987fc721f409574f"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_2d12ee13407d6e7449bcaf65534"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "bookingId"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "room_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "room_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_96f7e8ff4aec1491c0b6c52c0b8" FOREIGN KEY ("booking_id") REFERENCES "hotel_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_701f4807172cea1358d95a0b8ce" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_701f4807172cea1358d95a0b8ce"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_96f7e8ff4aec1491c0b6c52c0b8"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "booking_id" character varying`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "room_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "room_id" character varying`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "roomId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "bookingId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_2d12ee13407d6e7449bcaf65534" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_2743e4a018e987fc721f409574f" FOREIGN KEY ("bookingId") REFERENCES "hotel_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
