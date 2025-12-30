/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";

interface Props {
  product: any;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>
        {/* <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
