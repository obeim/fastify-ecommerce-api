import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceToNotNullable1749035146856 implements MigrationInterface {
  name = "PriceToNotNullable1749035146856";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Set NULL prices to a default (e.g. 0)
    await queryRunner.query(`
        UPDATE product SET price = 0 WHERE price IS NULL
      `);

    // 2. Make price column NOT NULL and proper type
    await queryRunner.query(`
        ALTER TABLE product 
        ALTER COLUMN price TYPE decimal(10, 2) USING price::decimal,
        ALTER COLUMN price SET NOT NULL
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" integer NOT NULL`
    );
  }
}
