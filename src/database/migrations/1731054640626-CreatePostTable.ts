import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable1731054640626 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`post\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`title\` VARCHAR(255) NOT NULL,
              \`content\` TEXT NOT NULL,
              \`user_id\` INT,
              \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`post\`;`);
    }

}
