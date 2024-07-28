import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgentAndAdminTables1714680398391 implements MigrationInterface {
    name = 'AddAgentAndAdminTables1714680398391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "marketing_agents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "should_receive_notifications" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_78c3812e6b97f6e6b204cbb96f" UNIQUE ("user_id"), CONSTRAINT "PK_abc4dc037f89f15d8fa83f721c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "group" character varying, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_2b901dd818a2a6486994d915a68" UNIQUE ("user_id"), CONSTRAINT "REL_2b901dd818a2a6486994d915a6" UNIQUE ("user_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_226b1c91784c64500273634044b"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "UQ_226b1c91784c64500273634044b" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_226b1c91784c64500273634044b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "marketing_agents" ADD CONSTRAINT "FK_78c3812e6b97f6e6b204cbb96f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_2b901dd818a2a6486994d915a68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_2b901dd818a2a6486994d915a68"`);
        await queryRunner.query(`ALTER TABLE "marketing_agents" DROP CONSTRAINT "FK_78c3812e6b97f6e6b204cbb96f7"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "FK_226b1c91784c64500273634044b"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" DROP CONSTRAINT "UQ_226b1c91784c64500273634044b"`);
        await queryRunner.query(`ALTER TABLE "hotel_staffs" ADD CONSTRAINT "FK_226b1c91784c64500273634044b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "marketing_agents"`);
    }

}
