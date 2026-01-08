"use server";

import { CartItem } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addItemToCart(prevState: any, data: CartItem) {
  return {
    success: true,
    message: "Item added to cart",
  };
}
