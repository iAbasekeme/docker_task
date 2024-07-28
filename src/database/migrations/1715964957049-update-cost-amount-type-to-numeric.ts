import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCostAmountTypeToNumeric1715964957049 implements MigrationInterface {
    name = 'UpdateCostAmountTypeToNumeric1715964957049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_categories" DROP COLUMN "cost_amount"`);
        await queryRunner.query(`ALTER TABLE "room_categories" ADD "cost_amount" numeric`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "cost_amount"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "cost_amount" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "cost_amount"`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "cost_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_categories" DROP COLUMN "cost_amount"`);
        await queryRunner.query(`ALTER TABLE "room_categories" ADD "cost_amount" integer`);
    }

}
