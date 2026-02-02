import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Minimum 5 characters" })
    .max(50, { message: "Maximum 20 characters" }),
  email: z
    .string()
    .email()
    .min(5, { message: "Minimum 5 characters" })
    .max(50, { message: "Maximum 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters" })
    .max(12, { message: "Maximum 12 characters" }),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email()
    .min(5, { message: "Minimum 5 characters" })
    .max(50, { message: "Maximum 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters" })
    .max(50, { message: "Maximum 12 characters" }),
});

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(30),
  }),
});

export const roomIdSchema = z.object({
  params: z.object({
    roomId: z.string().uuid(),
  }),
});
