import { Request, Response, NextFunction } from "express";
import HttpResponse from "@utils/response.mts";
import { AuthRequest } from "@/types/main.mts";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthRequest;

  if (authReq.user?.role !== "admin") {
    return HttpResponse.forbidden(res, "Access denied. Admin only.");
  }

  next();
};
