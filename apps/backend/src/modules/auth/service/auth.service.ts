import { signinData, signupData } from "../types/validation";
import { db } from "../../core/database";
import { user } from "../../core/database/schema";
import { eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../core/error/httpError";
import password from "../utility/password";
import cookie from "../utility/cookie";
import { IToken } from "../types";

class AuthService {
  public async signup(request: signupData) {
    const emailCheck = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.email, request.email))
      .limit(1);
    if (emailCheck.length > 0) {
      throw new BadRequestError("Email is already registered");
    }
    const hashPassword = await password.hashPassword(request.password);
    const newUser = await db
      .insert(user)
      .values({
        username: request.username,
        email: request.email,
        password: hashPassword,
      })
      .returning({
        id: user.id,
        email: user.email,
      });
    if (!newUser) {
      throw new BadRequestError("User is not created or Failed to create user");
    }
    const cookies = await cookie.generateCookie(newUser[0]);

    return { user: newUser[0], cookies };
  }

  public async signin(request: signinData) {
    console.log(request, "<--- service");
    const emailCheck = await db.query.user.findFirst({
      where: eq(user.email, request.email),
      columns: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!emailCheck) {
      throw new NotFoundError("User not found");
    }
    const hashedPassword = emailCheck.password;
    const comparePassword = await password.verifyPassword(
      request.password,
      hashedPassword
    );
    if (!comparePassword) {
      throw new BadRequestError("Password is incorrect");
    }
    const newUser = { id: emailCheck.id, email: emailCheck.email };
    const cookies = await cookie.generateCookie(newUser);
    return {
      user: newUser,
      cookies,
    };
  }

  public async profile(userId: string) {
    const userCheck = await db.query.user.findFirst({
      where: eq(user.id, userId),
      columns: {
        id: true,
        username: true,
        email: true,
      },
    });
    if (!userCheck) {
      throw new NotFoundError("user not found");
    }
    return userCheck;
  }

  public async refresh(token: string) {
    const decoded = cookie.verifyRefreshCookie(token) as IToken;

    const fetchedUser = await db.query.user.findFirst({
      where: eq(user.id, decoded.id),
      columns: {
        id: true,
        email: true,
      },
    });

    if (!fetchedUser) {
      throw new NotFoundError("User not found");
    }

    const cookies = await cookie.generateCookie(fetchedUser);

    const { sessionCookie, refreshCookie } = cookies;

    return { sessionCookie, refreshCookie };
  }

  public async logout(user_id: string) {
    const userCheck = await db.query.user.findFirst({
      where: eq(user.id, user_id),
    });
    if (!userCheck) {
      throw new NotFoundError("User not found");
    }
    return true;
  }
}
export default new AuthService();
