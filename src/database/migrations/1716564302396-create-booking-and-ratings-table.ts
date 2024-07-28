import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookingAndRatingsTable1716564302396 implements MigrationInterface {
    name = 'CreateBookingAndRatingsTable1716564302396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotel_bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guest_name" character varying NOT NULL, "guest_phone_number_intl" character varying NOT NULL, "guest_email" character varying NOT NULL, "user_id" character varying, "hotel_id" character varying NOT NULL, "country" character varying NOT NULL, "number_of_occupants" integer NOT NULL DEFAULT '1', "expected_arrival_date" TIMESTAMP NOT NULL, "expected_departure_date" TIMESTAMP NOT NULL, "duration_days" integer NOT NULL, "room_category_name" character varying NOT NULL, "room_category_id" uuid NOT NULL, "room_number" character varying NOT NULL, "room_id" uuid NOT NULL, "reservation_type" character varying NOT NULL, "special_request" json, "status" character varying NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "hotelId" uuid, CONSTRAINT "PK_33689dfe5dcc235cca4e6b24549" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "rating" integer NOT NULL, "hotel_id" uuid NOT NULL, "comment" text, "created_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_af990b15630014f2ef081e5e491" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_cca85480a5a5a41476b530a33b0" FOREIGN KEY ("room_category_id") REFERENCES "room_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_e745f25469d342910784b5f8942" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_9dc36f41492a78cbfd9e08a7a8e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_e2b1cc9c8d65278ed306cdbc32b" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_fbc355f317d28c7c9cb24d96df5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" ADD CONSTRAINT "FK_494e4be16b77552be343fd7e824" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_494e4be16b77552be343fd7e824"`);
        await queryRunner.query(`ALTER TABLE "hotel_ratings" DROP CONSTRAINT "FK_fbc355f317d28c7c9cb24d96df5"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_e2b1cc9c8d65278ed306cdbc32b"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_9dc36f41492a78cbfd9e08a7a8e"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_e745f25469d342910784b5f8942"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_cca85480a5a5a41476b530a33b0"`);
        await queryRunner.query(`DROP TABLE "hotel_ratings"`);
        await queryRunner.query(`DROP TABLE "hotel_bookings"`);
    }

}
