import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshToken1772388275675 implements MigrationInterface {
    name = 'AddRefreshToken1772388275675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashedRefreshToken"`);
    }

}
