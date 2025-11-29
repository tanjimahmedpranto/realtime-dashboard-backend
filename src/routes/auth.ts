// src/routes/auth.ts
import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

const router = Router();

const COOKIE_NAME = process.env.COOKIE_NAME || "token";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// small helper to know if we are in production on Render/Vercel
const isProduction = process.env.NODE_ENV === "production";

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  // Demo credentials – adjust if used other ones
  const DEMO_EMAIL = "demo@example.com";
  const DEMO_PASSWORD = "password123";

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // create JWT payload 
  const token = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: "7d"
  });

  // IMPORTANT: cross-site cookie settings
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,       // true on Render (https), false locally
    sameSite: isProduction ? "none" : "lax", // "none" so cross-site requests can send cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.json({ email });
});

// POST /auth/logout
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  });

  return res.json({ success: true });
});

// GET /auth/me - simple check using cookie (can also use req.user if you like)
router.get("/me", (req: AuthRequest, res: Response) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return res.json({ email: decoded.email });
  } catch (err) {
    console.error("Auth /me error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
