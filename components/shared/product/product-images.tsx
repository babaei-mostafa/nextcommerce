"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

const ProductImages = ({ images }: Props) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product-image"
        width={1000}
        height={1000}
        className="min-h-75 object-cover object-center"
      />
      <div className="flex gap-1">
        {images.length > 0 &&
          images.map((image, idx) => (
            <div
              key={image}
              onClick={() => setCurrent(idx)}
              className={cn(
                "border mr-2 cursor-pointer hover:border-orange-600",
                current === idx && "border-orange-400"
              )}
            >
              <Image src={image} alt="image" width={100} height={100} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductImages;
