import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSongStatus1773600858538 implements MigrationInterface {
    name = 'AddSongStatus1773600858538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."songs_status_enum" AS ENUM('processing', 'active', 'failed')`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "status" "public"."songs_status_enum" NOT NULL DEFAULT 'processing'`);
        await queryRunner.query(`ALTER TABLE "songs" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ALTER COLUMN "duration" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" ALTER COLUMN "duration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."songs_status_enum"`);
    }

}
