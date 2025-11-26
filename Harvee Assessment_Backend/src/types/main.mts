import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface UserPayload {
  id: string;
  role: string;
}
