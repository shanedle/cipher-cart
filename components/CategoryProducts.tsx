"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES_QUERYResult, Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Hot", value: "hot" },
  { label: "New", value: "new" },
  { label: "Sale", value: "sale" },
] as const;

type StatusType = (typeof STATUS_OPTIONS)[number]["value"];

interface Props {
  categories: CATEGORIES_QUERYResult;
}

const CategoryProducts = ({ categories }: Props) => {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [selectedStatus, setSelectedStatus] = useState<StatusType>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (categorySlug: string, status: StatusType) => {
    try {
      setLoading(true);
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)
        ${status !== "all" ? "&& status == $status" : ""}
        ] | order(name asc)
      `;
      const params: { categorySlug: string; status?: StatusType } = {
        categorySlug,
      };
      if (status !== "all") params.status = status;

      const data = await client.fetch(query, params);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSlug) {
      fetchProducts(currentSlug, selectedStatus);
    }
  }, [currentSlug, selectedStatus]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col min-w-[200px] max-w-[240px] w-full border bg-white overflow-hidden">
        {categories?.map((item) => (
          <Link
            key={item?._id}
            href={`/category/${item?.slug?.current ?? ""}`}
            passHref
            scroll={false}
          >
            <Button
              asChild
              className={`
                justify-start
                w-full
                px-4 py-2
                rounded-none
                border-0
                border-b last:border-b-0
                text-darkColor
                shadow-none
                font-semibold
                text-left
                whitespace-nowrap
                overflow-hidden
                transition
                duration-150
                ease-in
                ${
                  item?.slug?.current === currentSlug
                    ? "bg-darkColor text-white"
                    : "bg-transparent hover:bg-darkColor/80 hover:text-white"
                }
              `}
              style={{
                boxShadow: "none",
              }}
            >
              <span className="block w-full truncate" title={item?.title ?? ""}>
                {item?.title}
              </span>
            </Button>
          </Link>
        ))}
      </div>

      <div className="w-full">
        <div className="flex gap-2 mb-4">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedStatus === option.value ? "default" : "outline"}
              onClick={() => setSelectedStatus(option.value)}
              className="capitalize"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <motion.div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Product is loading...</span>
            </motion.div>
          </div>
        ) : products?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            <>
              {products?.map((product: Product) => (
                <AnimatePresence key={product?._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard key={product?._id} product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </>
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
