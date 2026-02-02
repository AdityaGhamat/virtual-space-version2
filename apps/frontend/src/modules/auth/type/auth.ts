import { z } from "zod";
import type {
  signupSchema,
  signinSchema,
  createRoomSchema,
  roomIdSchema,
} from "../validations";

export type signUpData = z.infer<typeof signupSchema>;
export type signInData = z.infer<typeof signinSchema>;

export type AuthResponse = {
  id: string;
  username: string;
  email: string;
};

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export type AuthContextType = {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
};

export type createRoomData = z.infer<typeof createRoomSchema>;
export type roomIdData = z.infer<typeof roomIdSchema>;
