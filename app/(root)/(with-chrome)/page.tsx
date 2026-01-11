import ProductList from "@/components/shared/product/product-list";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { cookies } from "next/headers";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  // if (sessionCartId) {
  //   const cart = await getMyCart(sessionCartId);
  //   console.log(cart);
  // }

  return <ProductList data={latestProducts} title="Newest Arrivals" />;
};

export default HomePage;
