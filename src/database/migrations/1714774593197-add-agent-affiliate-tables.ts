import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAgentAffiliateTables1714774593197 implements MigrationInterface {
    name = 'AddAgentAffiliateTables1714774593197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "affiliate_token" TO "affiliate_id"`);
        await queryRunner.query(`CREATE TABLE "agent_affiliates" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "agent_id" uuid NOT NULL, "affiliate_code" character varying NOT NULL, "time_of_use" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cf91c147d2fe88722bf2069a451" UNIQUE ("affiliate_code"), CONSTRAINT "PK_e48746b75a375823c278f18d370" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "affiliate_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "affiliate_id" integer`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03" UNIQUE ("affiliate_id")`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" ADD CONSTRAINT "FK_e04bfc054fe910ffdaea7aa1c26" FOREIGN KEY ("agent_id") REFERENCES "marketing_agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD CONSTRAINT "FK_59c24c29293b90f69b91d7cee03" FOREIGN KEY ("affiliate_id") REFERENCES "agent_affiliates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "FK_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "agent_affiliates" DROP CONSTRAINT "FK_e04bfc054fe910ffdaea7aa1c26"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP CONSTRAINT "UQ_59c24c29293b90f69b91d7cee03"`);
        await queryRunner.query(`ALTER TABLE "hotels" DROP COLUMN "affiliate_id"`);
        await queryRunner.query(`ALTER TABLE "hotels" ADD "affiliate_id" character varying`);
        await queryRunner.query(`DROP TABLE "agent_affiliates"`);
        await queryRunner.query(`ALTER TABLE "hotels" RENAME COLUMN "affiliate_id" TO "affiliate_token"`);
    }

}
