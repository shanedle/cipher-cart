"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Loader2, Search, X } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

import PriceView from "./PriceView";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    if (!search.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setShowResults(true);
    try {
      const query = `*[_type == "product" && (name match $search || description match $search || category->name match $search)] | order(_score desc, name asc) [0...10]`;
      const params = { search: `*${search}*` };
      const response = await client.fetch<Product[]>(query, params);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (search.trim()) {
        fetchProducts();
      } else {
        setProducts([]);
        setLoading(false);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, fetchProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  const handleInputFocus = () => {
    if (search.trim() || products.length > 0 || loading) {
      setShowResults(true);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setProducts([]);
    setLoading(false);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="relative w-full">
        <Input
          placeholder="Search products..."
          className="w-full rounded-md py-2 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500" // Adjusted padding: pl-10 for left icon, pr-10 for clear button
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.trim()) {
              setShowResults(true);
            }
          }}
          onFocus={handleInputFocus}
          aria-label="Search products"
        />
        <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        {search && !loading && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute top-0 right-0 h-full px-3 flex items-center justify-center text-gray-500 hover:text-red-600 hoverEffect z-10"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full mt-1.5 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-40 flex flex-col overflow-hidden max-h-[70vh]">
          <div className="overflow-y-auto">
            {loading && products.length === 0 ? (
              <p className="flex items-center justify-center px-4 py-6 gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </p>
            ) : products.length > 0 ? (
              products.map((product: Product) => (
                <div
                  key={product?._id}
                  className="hover:bg-gray-50 border-b last:border-b-0"
                >
                  <Link
                    href={`/product/${product?.slug?.current}`}
                    onClick={handleResultClick}
                    className="flex items-center p-3 gap-3 text-sm"
                  >
                    <div className="h-12 w-12 flex-shrink-0 border border-darkColor/10 rounded overflow-hidden">
                      {product?.images && product.images.length > 0 ? (
                        <Image
                          width={48}
                          height={48}
                          src={urlFor(product.images[0]).size(100, 100).url()}
                          alt={product.name ?? "Product image"}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {product?.name}
                      </h3>
                      {product?.intro && (
                        <p className="text-xs text-gray-600 truncate hidden sm:block">
                          {product.intro}
                        </p>
                      )}
                      <PriceView
                        price={product?.price}
                        discount={product?.discount}
                        className="text-xs md:text-sm"
                      />
                    </div>
                  </Link>
                </div>
              ))
            ) : search.trim() && !loading ? (
              <div className="text-center px-4 py-6 text-sm text-gray-500">
                No results found for{" "}
                <span className="font-semibold text-gray-700">{search}</span>.
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
