import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 3000,
  ip: process.env.HOST || "0.0.0.0",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    name: process.env.DB_NAME || "postgres",
  },
  jwtSecret: process.env.JWT_SECRET || "jkl!±@£!@ghj1237",
  env: process.env.NODE_ENV,
};

export type Config = typeof config;

export default config;
