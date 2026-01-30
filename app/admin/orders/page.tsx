import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { requireAdmin } from "@/lib/auth-guard";
import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";

export const metadata: Metadata = {
  title: "Admin Orders",
};

interface Props {
  searchParams: Promise<{ page: string; query: string }>;
}

const AdminOrdersPage = async ({ searchParams }: Props) => {
  await requireAdmin();
  const { page = "1", query = "" } = await searchParams;
  const orders = await getAllOrders({ page: Number(page), query });
  console.log(orders);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="h2-bold">Orders</h1>
        {query && (
          <div className="flex items-center gap-2">
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{" "}
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      {!orders || orders.data.length === 0 ? (
        <div>
          Orders list is empty. <Link href="/cart">Go to Your Cart</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>BUYER</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : "Not Paid"}
                  </TableCell>

                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : "Not Delivered"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button asChild variant="outline">
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders.totalPages}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
