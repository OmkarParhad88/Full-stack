import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}