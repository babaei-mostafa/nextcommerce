import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = Omit<
  z.infer<typeof insertProductSchema>,
  "price" | "rating"
> & {
  id: string;
  rating: string;
  createdAt: Date;
  price: string;
};
