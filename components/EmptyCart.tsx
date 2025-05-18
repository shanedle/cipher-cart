"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const EmptyCart = () => {
  return (
    <section className="flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full space-y-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <ShoppingCart size={48} className="text-blue-500" />
        </div>

        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Your cart is feeling lonely
          </h2>
          <p className="text-gray-600">
            You haven&apos;t added anything yet. Explore the shop and pick out
            something you&apos;ll love.
          </p>
        </div>

        <Link
          href="/"
          className="block rounded-full border border-darkColor/20 bg-darkColor/5 py-2.5 text-center text-sm font-semibold tracking-wide hover:border-darkColor hover:bg-darkColor hover:text-white"
        >
          Discover Products
        </Link>
      </div>
    </section>
  );
};

export default EmptyCart;
