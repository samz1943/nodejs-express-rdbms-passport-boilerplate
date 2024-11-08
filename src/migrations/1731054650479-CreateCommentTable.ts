import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentTable1731054650479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`comment\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`content\` TEXT NOT NULL,
              \`post_id\` INT,
              \`user_id\` INT,
              \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE,
              FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
            );
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`comment\`;`);
    }

}
