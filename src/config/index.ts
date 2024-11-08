import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql'; // Adjust dialect as needed
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
  jwt_secret: string;
  jwt_refresh_secret: string;
  access_token_expiry: string;
  refresh_token_expiry: string;
  mail_host: string;
  mail_port: number;
  mail_username: string;
  mail_password: string;
}

const config: Config = {
  development: {
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',  // Adjust the dialect if you need a different one
  },
  test: {
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',  // Adjust the dialect if you need a different one
  },
  production: {
    username: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? '',
    host: process.env.DB_HOST ?? '',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',  // Adjust the dialect if you need a different one
  },
  jwt_secret: process.env.JWT_SECRET ?? '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET ?? '',
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY ?? '',
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY ?? '',
  mail_host: process.env.MAIL_HOST ?? '',
  mail_port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
  mail_username: process.env.MAIL_USERNAME ?? '',
  mail_password: process.env.MAIL_PASSWORD ?? '',
};

export default config;
