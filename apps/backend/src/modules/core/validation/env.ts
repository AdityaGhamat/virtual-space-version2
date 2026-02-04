import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.string().default("3000"),

  DATABASE_URL: z.string({ message: "DATABASE_URL is missing" }),
  COOKIE_SECRET_KEY: z.string({
    message: "COOKIE_SECRET_KEY is missing",
  }),
  COOKIE_REFRESH_SECRET: z.string({
    message: "COOKIE_REFRESH_SECRET is missing",
  }),
  QUEUE_URL: z.string({ message: "QUEUE_URL is missing" }),
});

const ValidEnv = envSchema.parse(process.env);

export default ValidEnv;
