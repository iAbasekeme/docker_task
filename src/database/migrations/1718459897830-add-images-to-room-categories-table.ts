import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImagesToRoomCategoriesTable1718459897830 implements MigrationInterface {
    name = 'AddImagesToRoomCategoriesTable1718459897830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_categories" ADD "images" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_categories" DROP COLUMN "images"`);
    }

}
