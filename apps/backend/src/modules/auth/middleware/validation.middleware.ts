import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../core/error/httpError";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodSchema<T>, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");

        throw new BadRequestError(message);
      }
      throw err;
    }
  };
