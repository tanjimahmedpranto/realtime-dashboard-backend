import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME || "token";

export interface AuthRequest extends Request {
  user?: { email: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
