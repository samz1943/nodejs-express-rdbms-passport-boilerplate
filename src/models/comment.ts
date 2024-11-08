import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
interface CommentAttributes {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public user_id!: number;
  public post_id!: number;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Comment.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
    Comment.belongsTo(models.Post, { as: 'post', foreignKey: 'post_id' });
  }

  static initModel(sequelize: Sequelize) {
    Comment.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        post_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Comment',
        tableName: 'comments',
      }
    );
  }
}

export default Comment;
