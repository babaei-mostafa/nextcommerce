import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateOrderToPaidCOD } from "@/lib/actions/order.actions";
import { toast } from "sonner";

interface Props {
  orderId: string;
}

const MarkAsPaidButton = ({ orderId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(orderId);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
    });
  };
  return (
    <Button type="button" disabled={isPending} onClick={handleClick}>
      {isPending ? "Processing..." : "Mark As Paid"}
    </Button>
  );
};

export default MarkAsPaidButton;
