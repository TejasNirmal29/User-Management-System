import { NextFunction, Request, Response } from "express";
import JWT, { SignOptions } from "jsonwebtoken";
import HttpResponse from "@utils/response.mts";
import { AuthRequest, UserPayload } from "@/types/main.mts";
import JWTConfig from "@/configs/jwt.mts";
import MESSAGES from "@constants/message.mts";

const { ERROR } = MESSAGES;

class JWTService {
  public static signToken(payload: UserPayload): string {
    const token = JWT.sign(payload, JWTConfig.SECRET, {
      expiresIn: JWTConfig.ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
    return token;
  }

  public static generateToken(payload: object, expiresIn?: string): string {
    const token = JWT.sign(payload, JWTConfig.SECRET, {
      expiresIn: expiresIn || JWTConfig.REFRESH_TOKEN_EXPIRY,
    } as SignOptions);
    return token;
  }

  public static verifyToken(token: string): UserPayload | null {
    try {
      const decoded = JWT.verify(token, JWTConfig.SECRET) as UserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  public static isAuth(req: Request, res: Response, next: NextFunction): void {
    const authReq = req as AuthRequest;
    const authorization = req.headers.authorization;
    if (authorization) {
      try {
        const token = authorization.split(" ")[1];
        if (token) {
          const user = JWTService.verifyToken(token);
          if (user) {
            authReq.user = user;
            next();
          } else {
            HttpResponse.unauthorized(res, ERROR.INVALID_OR_EXPIRED_TOKEN);
          }
        } else {
          HttpResponse.unauthorized(res, ERROR.INVALID_TOKEN_PROVIDED);
        }
      } catch (error) {
        console.warn(error);
        HttpResponse.internalServerError(
          res,
          MESSAGES.ERROR.SERVER_ERROR,
          error
        );
      }
    } else {
      HttpResponse.unauthorized(res, ERROR.NO_TOKEN_PROVIDED);
    }
  }

  public static isAPIKey(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const apiKey = req.headers["api-access-key"];
    if (apiKey) {
      // authorization header found
      try {
        if (apiKey !== process.env.API_ACCESS_KEY)
          return HttpResponse.badRequest(res, ERROR.INVALID_API_KEY);
        next();
      } catch (error) {
        HttpResponse.internalServerError(
          res,
          MESSAGES.ERROR.SERVER_ERROR,
          error
        );
      }
    } else {
      // no token attached
      HttpResponse.unauthorized(res, ERROR.MISSING_API_KEY);
    }
  }
}

export default JWTService;
