import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

const SingleProduct = async ({ params }: Props) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <>{product.name}</>;
};

export default SingleProduct;
