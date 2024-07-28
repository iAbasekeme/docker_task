import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankDetailTable1717595202824 implements MigrationInterface {
    name = 'AddBankDetailTable1717595202824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_e2b1cc9c8d65278ed306cdbc32b"`);
        await queryRunner.query(`CREATE TABLE "check_ins_check_outs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "booking_id" uuid NOT NULL, "check_in_check_out_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb3a9ea3b0b1616c39b9245dbdb" UNIQUE ("booking_id", "check_in_check_out_type"), CONSTRAINT "PK_f4c8206cdd14c33d27c6de68999" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bank_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying NOT NULL, "account_number" character varying NOT NULL, "bank_name" character varying NOT NULL, "hotel_id" uuid NOT NULL, "bank_sort_code" integer NOT NULL, "default" boolean NOT NULL, CONSTRAINT "PK_ddbbcb9586b7f4d6124fe58f257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP COLUMN "hotel_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD "hotel_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "check_ins_check_outs" ADD CONSTRAINT "FK_d74958b2d39234b65216230a1a3" FOREIGN KEY ("booking_id") REFERENCES "hotel_bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bank_details" ADD CONSTRAINT "FK_d50a5a3f6bd578cecf9e1fb0130" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_061922f243c805fb7d3cdd55cf7" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP CONSTRAINT "FK_061922f243c805fb7d3cdd55cf7"`);
        await queryRunner.query(`ALTER TABLE "bank_details" DROP CONSTRAINT "FK_d50a5a3f6bd578cecf9e1fb0130"`);
        await queryRunner.query(`ALTER TABLE "check_ins_check_outs" DROP CONSTRAINT "FK_d74958b2d39234b65216230a1a3"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" DROP COLUMN "hotel_id"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD "hotel_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD "hotelId" uuid`);
        await queryRunner.query(`DROP TABLE "bank_details"`);
        await queryRunner.query(`DROP TABLE "check_ins_check_outs"`);
        await queryRunner.query(`ALTER TABLE "hotel_bookings" ADD CONSTRAINT "FK_e2b1cc9c8d65278ed306cdbc32b" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
