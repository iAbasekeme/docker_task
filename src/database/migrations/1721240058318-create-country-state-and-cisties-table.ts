import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryStateAndCistiesTable1721240058318 implements MigrationInterface {
    name = 'CreateCountryStateAndCistiesTable1721240058318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country_code_iso3" character varying NOT NULL, "country_code_iso2" character varying NOT NULL, "numeric_code" character varying NOT NULL, "phone_code" character varying NOT NULL, "capital" character varying NOT NULL, "currency" character varying NOT NULL, "currency_name" character varying NOT NULL, "currency_symbol" character varying NOT NULL, "timezones" json, "coordinates" geography(Point,4326), "emoji" character varying NOT NULL, "emojiU" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "country_id" character varying NOT NULL, "country_code" character varying NOT NULL, "country_name" character varying NOT NULL, "coordinates" geography(Point,4326), "state_code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "countryId" uuid, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "state_id" uuid NOT NULL, "state_code" character varying NOT NULL, "state_name" character varying NOT NULL, "country_id" uuid NOT NULL, "country_code" character varying NOT NULL, "country_name" character varying NOT NULL, "coordinates" geography(Point,4326), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "city_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "country_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "state_id" uuid`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_76ac7edf8f44e80dff569db7321" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_1229b56aa12cae674b824fccd13" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_7a841d270a1ef2ec9476110b7db" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_5179fd7ad4a3dba04e5613d2921" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_789d6b94112eb55c4e84aac5885" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_789d6b94112eb55c4e84aac5885"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_5179fd7ad4a3dba04e5613d2921"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_7a841d270a1ef2ec9476110b7db"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_4aa0d9a52c36ff93415934e2d2b"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_1229b56aa12cae674b824fccd13"`);
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_76ac7edf8f44e80dff569db7321"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "state_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "country_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "city" character varying`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "states"`);
        await queryRunner.query(`DROP TABLE "countries"`);
    }

}
