import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCommentTable1731054650479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'comment',
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
                        name: "post_id",
                        type: "int",
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
            })
        )

        await queryRunner.createForeignKey(
            "comment",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "CASCADE",
            }),
        )

        await queryRunner.createForeignKey(
            "comment",
            new TableForeignKey({
                columnNames: ["post_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "post",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("comment")
    }

}
