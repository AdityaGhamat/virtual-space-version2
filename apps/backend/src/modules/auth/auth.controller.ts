import { Request, Response } from "express";
import authService from "./service/auth.service";
import { signinData, signupData } from "./types";
import { ErrorResponse, SuccessResponse } from "./utility";
class AuthController {
  constructor() {}
  public async SignUpMethod(req: Request, res: Response) {
    try {
      const reqBody = req.body as signupData;
      const response = await authService.signup(reqBody);
      const { user, cookies } = response;
      const { sessionCookie, refreshCookie } = cookies;
      res
        .cookie("session", sessionCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refresh", refreshCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 60 * 60 * 1000,
        });
      return SuccessResponse(res, 201, user, "User signup is complete");
    } catch (error) {
      return ErrorResponse(res, 400, {}, "", error);
    }
  }
  public async SignInMethod(req: Request, res: Response) {
    console.log(req.body); //<------ cosnole log is here
    try {
      const reqBody = req.body as signinData;
      const response = await authService.signin(reqBody);
      const { user, cookies } = response;
      const { sessionCookie, refreshCookie } = cookies;
      res
        .cookie("session", sessionCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refresh", refreshCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 60 * 60 * 1000,
        });
      return SuccessResponse(res, 201, user, "User signin is complete");
    } catch (error) {
      return ErrorResponse(res, 400, {}, "", error);
    }
  }
  public async ProfileMethod(req: Request, res: Response) {
    const user = req.user;
    const userId = user.id;
    const response = await authService.profile(userId);

    return SuccessResponse(res, 200, response, "User is fetched successfully");
  }

  public async RefreshCookieMethod(req: Request, res: Response) {
    try {
      const tokenFromCookie = req.cookies.refresh as string;
      if (!tokenFromCookie) {
        return ErrorResponse(res, 401, {}, "", { message: "token not found" });
      }
      const { refreshCookie, sessionCookie } = await authService.refresh(
        tokenFromCookie
      );
      res
        .cookie("session", sessionCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refresh", refreshCookie, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 60 * 60 * 1000,
        });
      return SuccessResponse(res, 200, {}, "successfully refreshed cookies");
    } catch (error) {
      return ErrorResponse(res, 400, {}, "", error);
    }
  }
  public async LogoutMethod(req: Request, res: Response) {
    try {
      const { id } = req.user;
      await authService.logout(id);
      res.clearCookie("session").clearCookie("refresh");
      return SuccessResponse(res, 200, {}, "Successfully logged out");
    } catch (error) {
      return ErrorResponse(res, 400, {}, "", error);
    }
  }
}

export default new AuthController();
