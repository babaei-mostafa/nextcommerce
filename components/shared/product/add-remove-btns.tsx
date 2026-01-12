"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Minus, Plus, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";

interface Props {
  item: CartItem;
  cart?: Cart;
}

const AddRemoveButtons = ({ item, cart }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addData, addAction] = useActionState(addItemToCart, {
    success: false,
    message: "",
  });

  const [removeData, removeAction] = useActionState(removeItemFromCart, {
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

  // Handle remove feedback
  useEffect(() => {
    if (removeData.success) {
      toast.success(removeData.message);
      router.refresh();
    } else if (removeData.message) {
      toast.error(removeData.message);
    }
  }, [removeData, router]);

  const handleAddToCart = () => {
    startTransition(() => {
      addAction(item);
    });
  };

  const handleRemoveItemFromCart = () => {
    startTransition(() => {
      removeAction(item.productId);
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((elem) => elem.productId === item.productId);
  return (
    existItem && (
      <div className="flex-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-4 w-4"
          onClick={handleRemoveItemFromCart}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </Button>
        <span className="px-2">{existItem.qty}</span>
        <Button
          type="button"
          variant="outline"
          className="h-4 w-4"
          onClick={handleAddToCart}
        >
          {isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    )
  );
};

export default AddRemoveButtons;
