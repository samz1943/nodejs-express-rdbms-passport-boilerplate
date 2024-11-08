import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface PostAttributes {
  id: number;
  user_id: number;
  title: string;
  content: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public user_id!: number;
  public title!: string;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Post.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
    Post.hasMany(models.Comment, { as: 'comments', foreignKey: 'post_id' });
  }

  static initModel(sequelize: Sequelize) {
    Post.init(
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
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
      }
    );
  }
}

export default Post;
