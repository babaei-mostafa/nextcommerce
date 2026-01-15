import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderItemSchema,
  insertOrderSchema,
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
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = Omit<z.infer<typeof insertOrderItemSchema>, "price"> & {
  price: string;
};
export type Order = Omit<
  z.infer<typeof insertOrderSchema>,
  "itemsPrice" | "shippingPrice" | "taxPrice" | "totalPrice"
> & {
  itemsPrice: string;
  shippingPrice: string;
  taxPrice: string;
  totalPrice: string;
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
};
