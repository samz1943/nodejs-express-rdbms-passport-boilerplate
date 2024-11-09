import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePostTable1731054640626 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'post',
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "content",
                        type: "text",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ]
            }),
            true,
        )

        await queryRunner.createForeignKey(
            "post",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("post")
    }

}
