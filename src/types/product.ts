export type ProductStatus = "active" | "inactive" | "archived";

export interface Product {
  id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
