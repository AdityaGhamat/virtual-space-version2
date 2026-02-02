import jwt, { SignOptions } from "jsonwebtoken";
import type { IToken } from "../types/utitlity";
import env from "../../core/utility/env";
class Cookie {
  private generateToken(payload: IToken, secret: string, options: SignOptions) {
    return jwt.sign(payload, secret, options);
  }
  public async generateCookie(payload: IToken) {
    const sessionCookie = this.generateToken(payload, env.COOKIE_SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshCookie = this.generateToken(
      payload,
      env.COOKIE_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return {
      sessionCookie,
      refreshCookie,
    };
  }

  public verifySessionCookie(token: string): IToken {
    return jwt.verify(token, env.COOKIE_SECRET_KEY) as IToken;
  }

  public verifyRefreshCookie(token: string) {
    return jwt.verify(token, env.COOKIE_REFRESH_SECRET);
  }
}

export default new Cookie();
