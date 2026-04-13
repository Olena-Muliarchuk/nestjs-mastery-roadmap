// src/config/typeorm-cli.config.ts
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: isProd ? ['dist/**/*.entity.js'] : ['@app/nest-zero-to-hero/**/*.entity.ts'],

  migrations: isProd ? ['dist/db/migrations/*.js'] : ['@app/nest-zero-to-hero/db/migrations/*.ts'],
});
