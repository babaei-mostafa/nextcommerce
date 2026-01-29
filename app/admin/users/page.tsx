import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Users",
};

interface Props {
  searchParams: Promise<{ query: string; page: number }>;
}

const AdminUsersPage = async ({ searchParams }: Props) => {
  const { query = "", page = "1" } = await searchParams;
  const users = await getAllUsers({ query, page: Number(page) });
  console.log(users);
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/create">Create User</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead className="w-25">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{formatId(user.id)}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.role === "user" ? (
                  <Badge variant="secondary">User</Badge>
                ) : user.role === "admin" ? (
                  <Badge variant="default">Admin</Badge>
                ) : (
                  <Badge variant="outline">{user.role}</Badge>
                )}
              </TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${user.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={user.id} action={deleteUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.totalPages > 1 && (
        <Pagination page={page} totalPages={users.totalPages} />
      )}
    </div>
  );
};

export default AdminUsersPage;
