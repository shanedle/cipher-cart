"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { productType } from "@/constants";

import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = `*[_type == "product"] | order(name asc)`;

    (async () => {
      setLoading(true);
      try {
        const response = await client.fetch<Product[]>(query);
        setProducts(response);
      } catch (err) {
        console.error("Product fetching error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    return productType.reduce<Record<string, Product[]>>((acc, t) => {
      acc[t.value] = products.filter(
        (p) => p.status?.toLowerCase() === t.value.toLowerCase()
      );
      return acc;
    }, {});
  }, [products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="animate-spin" />
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return <NoProductAvailable selectedTab="all" />;
  }

  return (
    <div className="mt-10 flex flex-col items-center w-full">
      {productType.map(({ title, value }) => {
        const list = grouped[value] ?? [];
        if (!list.length) return null;

        return (
          <section key={value} className="w-full mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 px-1">
              {title}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {list.map((product) => (
                <AnimatePresence key={product._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductGrid;
