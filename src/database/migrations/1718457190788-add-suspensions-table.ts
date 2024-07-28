import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuspensionsTable1718457190788 implements MigrationInterface {
    name = 'AddSuspensionsTable1718457190788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suspensions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying, "entity_id" uuid NOT NULL, "entity_type" character varying NOT NULL, "supposed_released_at" TIMESTAMP WITH TIME ZONE, "released_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c3df8984cf2c9a5726c11644474" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "suspensions"`);
    }

}
