import { z } from "zod";
import { signupSchema, signinSchema } from "../validation";

export type signupData = z.infer<typeof signupSchema>;
export type signinData = z.infer<typeof signinSchema>;
