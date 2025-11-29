import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

const DEMO_USER = {
  email: "demo@example.com",
  password: "password123"
};

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1d"
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // change to true in production with https
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });

  return res.json({ email });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ success: true });
});

router.get("/me", (req: Request, res: Response) => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
    };
    return res.json({ email: decoded.email });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
