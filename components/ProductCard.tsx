import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import PriceView from "./PriceView";
import Link from "next/link";
import Title from "./Title";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group text-sm rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 overflow-hidden relative">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-72 object-contain overflow-hidden transition-transform duration-500 ${product?.stock !== 0 && "group-hover:scale-105"}`}
            />
          </Link>
        )}

        {product?.stock === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-darkColor/50 flex items-center justify-center">
            <p className="text-xl text-white font-semibold text-center">
              Out of Stock
            </p>
          </div>
        )}

        {product?.status && (
          <span
            className={`
              absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full
              ${
                product.status === "new"
                  ? "bg-green-600 text-white"
                  : product.status === "hot"
                    ? "bg-red-500 text-white"
                    : product.status === "sale"
                      ? "bg-yellow-400 text-black"
                      : ""
              }
            `}
          >
            {product.status.toUpperCase()}
          </span>
        )}
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-lg rounded-tl-none rounded-tr-none">
        <Title className="text-base line-clamp-1">{product?.name}</Title>
        <p>{product?.intro}</p>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-lg"
        />
      </div>
    </div>
  );
};

export default ProductCard;
