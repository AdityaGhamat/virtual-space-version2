import { Request, Response, NextFunction } from "express";
import cookie from "../utility/cookie";
import { ErrorResponse } from "../utility";
export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let tokenFromHeader;
  const tokenFromCookie = req.cookies.session;
  console.log("token ->", tokenFromCookie);
  const authHeader = req?.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    tokenFromHeader = authHeader?.split(" ")[1];
  }
  const token = tokenFromCookie || tokenFromHeader;
  if (!token) {
    return ErrorResponse(res, 401, {}, "", { message: "token not found" });
  }
  try {
    const decoded = cookie.verifySessionCookie(token);
    req.user = decoded;
    next();
  } catch (error) {
    return ErrorResponse(res, 401, {}, "Session Expired", {
      message: "Invalid or expired token",
    });
  }
}
