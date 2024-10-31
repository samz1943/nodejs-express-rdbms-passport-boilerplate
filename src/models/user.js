'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { as: 'posts', foreignKey: 'user_id' });
      User.hasMany(models.Comment, { as: 'comments', foreignKey: 'user_id' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    verificationToken: DataTypes.STRING,
    tokenExpiration: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};