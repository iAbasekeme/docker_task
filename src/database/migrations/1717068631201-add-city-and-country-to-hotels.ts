import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCityAndCountryToHotels1717068631201 implements MigrationInterface {
    name = 'AddCityAndCountryToHotels1717068631201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "country"`);
    }

}
