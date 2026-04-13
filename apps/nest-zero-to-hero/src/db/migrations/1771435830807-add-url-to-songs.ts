import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUrlToSongs1771435830807 implements MigrationInterface {
    name = 'AddUrlToSongs1771435830807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs" DROP CONSTRAINT "FK_909b985984ad0e366bcdb4224d0"`);
        await queryRunner.query(`CREATE TABLE "songs_artists" ("songsId" integer NOT NULL, "artistsId" integer NOT NULL, CONSTRAINT "PK_78eb64551964b78d544c2ac019b" PRIMARY KEY ("songsId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_971d95bf6df45f2b07c317b6b3" ON "songs_artists" ("songsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f43a7e4032521e4edd2e7ecd2" ON "songs_artists" ("artistsId") `);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "artistId"`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "url" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "lyrics" text`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "duration" TIME NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34" FOREIGN KEY ("songsId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "songs_artists" ADD CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_3f43a7e4032521e4edd2e7ecd29"`);
        await queryRunner.query(`ALTER TABLE "songs_artists" DROP CONSTRAINT "FK_971d95bf6df45f2b07c317b6b34"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "lyrics"`);
        await queryRunner.query(`ALTER TABLE "songs" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "songs" ADD "artistId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f43a7e4032521e4edd2e7ecd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_971d95bf6df45f2b07c317b6b3"`);
        await queryRunner.query(`DROP TABLE "songs_artists"`);
        await queryRunner.query(`ALTER TABLE "songs" ADD CONSTRAINT "FK_909b985984ad0e366bcdb4224d0" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
