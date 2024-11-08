import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1731054452272 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`username\` VARCHAR(255) UNIQUE NOT NULL,
              \`email\` VARCHAR(255) UNIQUE NOT NULL,
              \`password\` VARCHAR(255) NOT NULL,
              \`isVerified\` BOOLEAN DEFAULT true,
              \`verificationToken\` VARCHAR(255) NULL,
              \`tokenExpiration\` DATETIME NOT NULL,
              \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\`;`);
    }

}
