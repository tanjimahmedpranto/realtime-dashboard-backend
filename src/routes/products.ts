import { Router, Response } from "express";
import { db } from "../config/firebase";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { ProductStatus } from "../types/product";
import admin from "firebase-admin";

const router = Router();
const collection = db.collection("products");

// All routes in this file need auth
router.use(authMiddleware);

// GET all products
router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    const snapshot = await collection.orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST create product
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, stock, category, status } = req.body as {
      name: string;
      price: number;
      stock: number;
      category: string;
      status?: ProductStatus;
    };

    if (!name || price == null || stock == null || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const now = admin.firestore.Timestamp.now();

    const docRef = await collection.add({
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      status: status || "active",
      createdAt: now,
      updatedAt: now
    });

    const newDoc = await docRef.get();
    return res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// PUT update product
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category, status } = req.body as {
      name?: string;
      price?: number;
      stock?: number;
      category?: string;
      status?: ProductStatus;
    };

    const docRef = collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates: any = {
      updatedAt: admin.firestore.Timestamp.now()
    };

    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = Number(price);
    if (stock !== undefined) updates.stock = Number(stock);
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// PATCH change status only
router.patch("/:id/status", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: ProductStatus };

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const docRef = collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await docRef.update({
      status,
      updatedAt: admin.firestore.Timestamp.now()
    });

    const updatedDoc = await docRef.get();
    return res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update status" });
  }
});

// DELETE product
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await docRef.delete();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
