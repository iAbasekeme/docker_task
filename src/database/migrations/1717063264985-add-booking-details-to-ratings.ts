import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookingDetailsToRatings1717063264985 implements MigrationInterface {
    name = 'AddBookingDetailsToRatings1717063264985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "room_id" character varying`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "booking_id" character varying`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "images" json`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "bookingId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD "roomId" uuid`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_2743e4a018e987fc721f409574f" FOREIGN KEY ("bookingId") REFERENCES "hotel_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_2d12ee13407d6e7449bcaf65534" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_2d12ee13407d6e7449bcaf65534"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_2743e4a018e987fc721f409574f"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "roomId"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "bookingId"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP COLUMN "room_id"`);
    }

}
