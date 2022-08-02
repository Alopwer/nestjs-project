import { MigrationInterface, QueryRunner } from "typeorm"

export class TestMigration1659440120156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "users" RENAME COLUMN "username" TO "name"`,
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
        `ALTER TABLE "users" RENAME COLUMN "name" TO "username"`,
      );
    }

}
