import { DBConfig } from './config';
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from 'typeorm-extension';
import MainSeeder from "./database/seeders/main.seeder";
import config from './config';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

const options: DataSourceOptions & SeederOptions = {
  type: (dbConfig as DBConfig).dialect,
  host: (dbConfig as DBConfig).host,
  port: (dbConfig as DBConfig).port,
  username: (dbConfig as DBConfig).username,
  password: (dbConfig as DBConfig).password,
  database: (dbConfig as DBConfig).database,
  synchronize: false,
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/database/migrations/*.ts'],
  seeds: [MainSeeder],
  factories: ['src/database/factories/*.ts'],
  subscribers: []
};

export const AppDataSource = new DataSource(options);
