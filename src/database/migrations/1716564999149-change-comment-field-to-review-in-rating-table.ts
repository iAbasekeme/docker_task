import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCommentFieldToReviewInRatingTable1716564999149 implements MigrationInterface {
    name = 'ChangeCommentFieldToReviewInRatingTable1716564999149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" RENAME COLUMN "comment" TO "review"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel_ratings" RENAME COLUMN "review" TO "comment"`);
    }

}
