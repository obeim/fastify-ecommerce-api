import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entity/User";

export class RootUser1725643068688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert(
      User,
      queryRunner.manager.create(User, [
        {
          firstName: "Admin",
          lastName: "admin",
          age: 18,
          username: "admin",
          email: "admin@admin.com",
          password: "123456",
          role: "admin",
        },
      ])
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, { email: "admin@admin.com" });
  }
}
