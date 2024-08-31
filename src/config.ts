import { Pool } from "pg";
import "dotenv/config";

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;

export const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: port,
  database: process.env.DB_DATABASE,
});