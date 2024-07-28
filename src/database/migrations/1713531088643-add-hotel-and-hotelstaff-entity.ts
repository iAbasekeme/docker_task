import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHotelAndHotelstaffEntity1713531088643 implements MigrationInterface {
    name = 'AddHotelAndHotelstaffEntity1713531088643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hotels" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "owner_id" character varying, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2bb06797684115a1ba7c705fc7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hotel_staffs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "hotel_id" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'member', "email" character varying NOT NULL, "should_receive_notifications" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "hotelId" uuid, CONSTRAINT "PK_d8ff0e610e29588ee17bdaabecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_226b1c91784c64500273634044b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_28ea7646455f6426313a02b8af7" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_28ea7646455f6426313a02b8af7"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_226b1c91784c64500273634044b"`);
        await queryRunner.query(`DROP TABLE "hotel_staffs"`);
        await queryRunner.query(`DROP TABLE "hotels"`);
    }

}
