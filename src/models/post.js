'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      Post.hasMany(models.Comment, { as: 'comments', foreignKey: 'post_id' });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};