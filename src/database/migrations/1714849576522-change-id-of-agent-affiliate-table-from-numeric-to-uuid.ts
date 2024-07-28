import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdOfAgentAffiliateTableFromNumericToUuid1714849576522 implements MigrationInterface {
    name = 'ChangeIdOfAgentAffiliateTableFromNumericToUuid1714849576522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP CONSTRAINT "PK_e48746b75a375823c278f18d370"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD CONSTRAINT "PK_e48746b75a375823c278f18d370" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "affiliate_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "affiliate_id" uuid`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03" UNIQUE ("affiliate_id")`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_59c24c29293b90f69b91d7cee03" FOREIGN KEY ("affiliate_id") REFERENCES "agent_affiliates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "affiliate_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "affiliate_id" integer`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03" UNIQUE ("affiliate_id")`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP CONSTRAINT "PK_e48746b75a375823c278f18d370"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD CONSTRAINT "PK_e48746b75a375823c278f18d370" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_59c24c29293b90f69b91d7cee03" FOREIGN KEY ("affiliate_id") REFERENCES "agent_affiliates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
