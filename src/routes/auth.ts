import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const isProduction = process.env.NODE_ENV === "production";

// POST /auth/login
router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  // Demo credentials
  if (email !== "demo@example.com" || password !== "password123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,          // true on Render
    sameSite: isProduction ? "none" : "lax", // "none" for cross-site on Vercel
    path: "/",
  });

  return res.json({ email });
});

// POST /auth/logout
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.json({ success: true });
});

// GET /auth/me
router.get("/me", (req: Request, res: Response) => {
  const token = (req as any).cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return res.json({ email: decoded.email });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
