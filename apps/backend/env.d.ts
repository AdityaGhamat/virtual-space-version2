import { IToken } from "./src/modules/auth/types/utitlity";

export {};
declare global {
  namespace Express {
    interface Request {
      user: IToken;
    }
  }
  namespace NodeJs {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing";
      PORT: number;
      DATABASE_URL: string;
      COOKIE_SECRET_KEY: string;
      COOKIE_REFRESH_SECRET: string;
      QUEUE_URL: string;
    }
  }
}
