import { Sequelize } from 'sequelize';
import config from '../config';
import User from './user';
import Post from './post';
import Comment from './comment';

const environment = process.env.NODE_ENV as 'development' | 'test' | 'production' || 'development';
const dbConfig = config[environment];

const sequelize = new Sequelize(dbConfig.database!, dbConfig.username!, dbConfig.password!, {
  host: dbConfig.host,
  dialect: dbConfig.dialect as 'mysql',
});

// Initialize Models
const models = [User, Post, Comment];

// Initialize all models dynamically
models.forEach((model) => model.initModel(sequelize));

// Set up associations after all models are initialized
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

// Export Sequelize instance and models
export { sequelize, User, Post, Comment };

export default sequelize;
