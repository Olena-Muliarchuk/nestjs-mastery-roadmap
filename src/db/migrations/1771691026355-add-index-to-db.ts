import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToDb1771691026355 implements MigrationInterface {
    name = 'AddIndexToDb1771691026355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_70c3685e197743b963339d158c" ON "artists" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_92ca9b9b5394093adb6e5f55c4" ON "playlist" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_SONG_RELEASED_DATE" ON "songs" ("releasedDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_SONG_TITLE_DATE" ON "songs" ("title", "releasedDate") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_SONG_TITLE_DATE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_SONG_RELEASED_DATE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_92ca9b9b5394093adb6e5f55c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70c3685e197743b963339d158c"`);
    }

}
