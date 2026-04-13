import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToUsers1771685090353 implements MigrationInterface {
    name = 'AddSoftDeleteToUsers1771685090353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    }

}
