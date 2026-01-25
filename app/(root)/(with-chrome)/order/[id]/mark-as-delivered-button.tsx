import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { toast } from "sonner";

interface Props {
  orderId: string;
}

const MarkAsDeliveredButton = ({ orderId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await deliverOrder(orderId);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  };
  return (
    <Button type="button" disabled={isPending} onClick={handleClick} className="ml-2">
      {isPending ? "Processing..." : "Mark As Delivered"}
    </Button>
  );
};

export default MarkAsDeliveredButton;
