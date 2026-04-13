import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStorageKeyToSong1773516509233 implements MigrationInterface {
    name = 'AddStorageKeyToSong1773516509233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" ADD "storageKey" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "storageKey"`);
    }

}
