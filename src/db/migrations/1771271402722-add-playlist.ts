import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlaylist1771271402722 implements MigrationInterface {
    name = 'AddPlaylist1771271402722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "playlist_songs" ("playlistId" integer NOT NULL, "songsId" integer NOT NULL, CONSTRAINT "PK_305318cc99f7291f52ff0b27af6" PRIMARY KEY ("playlistId", "songsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b417e94c5022d641c977ef85d8" ON "playlist_songs" ("playlistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16a99d5ac74db9979a588b5167" ON "playlist_songs" ("songsId") `);
        await queryRunner.query(`ALTER TABLE "playlist" ADD CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "playlist_songs" ADD CONSTRAINT "FK_b417e94c5022d641c977ef85d8b" FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "playlist_songs" ADD CONSTRAINT "FK_16a99d5ac74db9979a588b5167c" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "playlist_songs" DROP CONSTRAINT "FK_16a99d5ac74db9979a588b5167c"`);
        await queryRunner.query(`ALTER TABLE "playlist_songs" DROP CONSTRAINT "FK_b417e94c5022d641c977ef85d8b"`);
        await queryRunner.query(`ALTER TABLE "playlist" DROP CONSTRAINT "FK_92ca9b9b5394093adb6e5f55c4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16a99d5ac74db9979a588b5167"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b417e94c5022d641c977ef85d8"`);
        await queryRunner.query(`DROP TABLE "playlist_songs"`);
        await queryRunner.query(`DROP TABLE "playlist"`);
    }

}
