import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthUser } from "../views/custom.types";

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
  try {
    jwt.verify(token, Bun.env.JWT_SECRET_KEY!, (err, user) => {
      if (err) {
        return res.status(401).json({ status: 401, message: "Unauthorized" });
      }
      req.user = user as AuthUser;
      next();
    });

  } catch (error) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
}