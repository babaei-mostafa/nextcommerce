"use client";

import { updateUserSchema } from "@/lib/validators";
import { UpdateUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: UpdateUser;
}

const UpdateUserForm = ({ user }: Props) => {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: UpdateUser) => {
    try {

      const res = await updateUser(values);

      if (!res.success) {
        return toast.error(res.message);
      }

      toast.success(res.message);
      form.reset();
      router.push("/admin/users");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
      >
        {/* Email */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Enter user email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name */}
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Role */}
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
