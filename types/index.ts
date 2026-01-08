import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
} from "@/lib/validators";

export type Product = Omit<
  z.infer<typeof insertProductSchema>,
  "price" | "rating"
> & {
  id: string;
  rating: string;
  createdAt: Date;
  price: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = Omit<z.infer<typeof cartItemSchema>, "price"> & {
  price: string;
};
