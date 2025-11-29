import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://my-frontend-domain.vercel.app", 
    ], 
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});


app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
