"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";

const AdminSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("query") ?? "";
  const [queryValue, setQueryValue] = useState(queryFromUrl);

  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (queryValue.trim()) {
      router.push(`${formActionUrl}?query=${encodeURIComponent(queryValue)}`);
    } else {
      router.push(formActionUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-25 lg:w-75"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
