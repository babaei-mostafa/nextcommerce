import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetOrderSummary } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCardIcon, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const AdminOverviewPage = async () => {
  await requireAdmin();

  const summary = await GetOrderSummary();
  console.log(summary);

  const cards = [
    {
      id: 1,
      title: "Total Revenue",
      icon: <BadgeDollarSign />,
      content: formatCurrency(Number(summary.totalSales._sum?.totalPrice) || 0),
    },
    {
      id: 2,
      title: "Sales",
      icon: <CreditCardIcon />,
      content: formatNumber(summary.ordersCount),
    },
    {
      id: 3,
      title: "Customers",
      icon: <Users />,
      content: formatNumber(summary.usersCount),
    },
    {
      id: 4,
      title: "Products",
      icon: <Barcode />,
      content: formatNumber(summary.productsCount),
    },
  ];

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-md">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "Deleted User"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
