import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersBookmarkTable1718467503794 implements MigrationInterface {
    name = 'CreateUsersBookmarkTable1718467503794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_bookmarks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hotel_id" uuid NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3fae9b67c1c879de104e4005cea" UNIQUE ("hotel_id", "user_id"), CONSTRAINT "PK_1d1b73d6be08cec5c83521e4432" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_bookmarks" ADD CONSTRAINT "FK_b5a7b14a72218dd5f0317bf6de6" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_bookmarks" ADD CONSTRAINT "FK_25d65ef3177821fbedcbce995dd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bookmarks" DROP CONSTRAINT "FK_25d65ef3177821fbedcbce995dd"`);
        await queryRunner.query(`ALTER TABLE "user_bookmarks" DROP CONSTRAINT "FK_b5a7b14a72218dd5f0317bf6de6"`);
        await queryRunner.query(`DROP TABLE "user_bookmarks"`);
    }

}
