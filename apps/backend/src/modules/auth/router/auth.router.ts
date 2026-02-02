import { Router } from "express";
import { signinSchema, signupSchema } from "../validation";
import { validate } from "../middleware/validation.middleware";
import authController from "../auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
const authRouter = Router();

authRouter.post(
  "/register",
  validate(signupSchema, "body"),
  authController.SignUpMethod
);

authRouter.post(
  "/login",
  validate(signinSchema, "body"),
  authController.SignInMethod
);

authRouter.get("/profile", AuthMiddleware, authController.ProfileMethod);

authRouter.get("/refresh", authController.RefreshCookieMethod);

authRouter.get("/logout", AuthMiddleware, authController.LogoutMethod);

export default authRouter;
