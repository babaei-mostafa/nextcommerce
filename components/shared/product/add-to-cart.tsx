"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import AddRemoveButtons from "./add-remove-btns";

interface Props {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = ({ item, cart }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addData, addAction] = useActionState(addItemToCart, {
    success: false,
    message: "",
  });

  // Handle add feedback
  useEffect(() => {
    if (addData.success) {
      toast.success(
        <div className="w-full flex items-center gap-4">
          <span>{addData.message}</span>
          <Button asChild>
            <Link href="/cart">Cart</Link>
          </Button>
        </div>
      );
      router.refresh();
    } else if (addData.message) {
      toast.error(addData.message);
    }
  }, [addData, router]);

  const handleAddToCart = () => {
    startTransition(() => {
      addAction(item);
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((elem) => elem.productId === item.productId);

  return existItem ? (
    <AddRemoveButtons item={item} cart={cart} />
  ) : (
    <Button className="w-full mt-auto" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}{" "}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
