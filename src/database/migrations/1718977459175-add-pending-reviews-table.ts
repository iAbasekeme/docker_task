import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPendingReviewsTable1718977459175 implements MigrationInterface {
    name = 'AddPendingReviewsTable1718977459175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pending_reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "hotel_id" uuid, "room_id" uuid, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a1c6b07e5eeb779dd15291eec66" UNIQUE ("user_id", "booking_id"), CONSTRAINT "REL_4da416c7cd84da04febffeadfe" UNIQUE ("booking_id"), CONSTRAINT "PK_0134dcd46d59cea51bd304d3927" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" ADD CONSTRAINT "FK_4da416c7cd84da04febffeadfe7" FOREIGN KEY ("booking_id") REFERENCES "hotel_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" ADD CONSTRAINT "FK_11f28b28e4ab67cd2174aaad6ae" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" ADD CONSTRAINT "FK_daa6ea431badff6dd2c6ebf1736" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" ADD CONSTRAINT "FK_a0343d4d7a7622e512a417994d6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_reviews" DROP CONSTRAINT "FK_a0343d4d7a7622e512a417994d6"`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" DROP CONSTRAINT "FK_daa6ea431badff6dd2c6ebf1736"`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" DROP CONSTRAINT "FK_11f28b28e4ab67cd2174aaad6ae"`);
        await queryRunner.query(`ALTER TABLE "pending_reviews" DROP CONSTRAINT "FK_4da416c7cd84da04febffeadfe7"`);
        await queryRunner.query(`DROP TABLE "pending_reviews"`);
    }

}
