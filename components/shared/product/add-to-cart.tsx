"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  item: CartItem;
}

const AddToCart = ({ item }: Props) => {
  const router = useRouter();
  const [data, action] = useActionState(addItemToCart, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (data.success) {
      toast.success(
        <div className="w-full flex items-center gap-4">
          <span>{item.name} added to cart</span>
          <Button asChild>
            <Link href="/cart">Cart</Link>
          </Button>
        </div>
      );
      router.refresh();
    } else if (data.message) {
      toast.error(data.message);
    }
  }, [data, router, item.name]);

  const handleAddToCart = () => {
    startTransition(() => {
      action(item);
    });
  };

  return (
    <>
      <Button
        className="w-full mt-auto"
        type="button"
        onClick={handleAddToCart}
      >
        + Add to Cart
      </Button>
    </>
  );
};

export default AddToCart;
