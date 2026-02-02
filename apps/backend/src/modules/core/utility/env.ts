import dotenv from "dotenv";
dotenv.config();

export default {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT as string,
  COOKIE_SECRET_KEY: process.env.COOKIE_SECRET_KEY as string,
  COOKIE_REFRESH_SECRET: process.env.COOKIE_REFRESH_SECRET as string,
  QUEUE_URL: process.env.QUEUE_URL as string,
};
