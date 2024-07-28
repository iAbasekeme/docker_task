import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomAverageRating1718968999161 implements MigrationInterface {
    name = 'AddRoomAverageRating1718968999161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "average_rating" integer NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "average_rating"`);
    }

}
