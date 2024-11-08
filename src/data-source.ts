import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from 'typeorm-extension';
import MainSeeder from "./seeders/main.seeder";
import { UserFactory } from "./factories/user.factory";
import { PostFactory } from "./factories/post.factory";
import { CommentFactory } from "./factories/comment.factory";

const options: DataSourceOptions & SeederOptions = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "",
  "password": "",
  "database": "typescript",
  "synchronize": false,
  "logging": true,
  "entities": ['src/entities/*.ts'],
  "migrations": ['src/migrations/*.ts'],
  "seeds": [MainSeeder],
  "factories": [UserFactory, PostFactory, CommentFactory],
  "subscribers": []
}

export const AppDataSource = new DataSource(options);