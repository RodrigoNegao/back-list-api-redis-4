import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSchemaLista1625509256053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema("lista1", true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema("lista1", true, true);
  }
}
