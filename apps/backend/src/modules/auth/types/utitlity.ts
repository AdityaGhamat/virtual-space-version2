import { JwtPayload } from "jsonwebtoken";

export interface IToken extends JwtPayload {
  id: string;
  email: string;
  [key: string]: any;
}
