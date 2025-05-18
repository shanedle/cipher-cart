import React from "react";
import Link from "next/link";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ListOrdered } from "lucide-react";

import { getAllCategories, getMyOrders } from "@/sanity/helpers";
import { CATEGORIES_QUERYResult } from "@/sanity.types";

import CartIcon from "./CartIcon";
import Container from "./Container";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";

export const dynamic = "force-dynamic";

const Header = async () => {
  const { userId } = await auth();
  const categories = await getAllCategories();

  let orders: Awaited<ReturnType<typeof getMyOrders>> | null = null;
  if (userId) {
    try {
      orders = await getMyOrders(userId);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      orders = [];
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-b-gray-300 py-3 md:py-4">
        <Container className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <MobileMenu categories={categories} />
            <Logo className="hidden md:inline-block">Cipher Cart</Logo>
          </div>

          <div className="flex-grow flex justify-center px-2 sm:px-4 mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <SearchBar />
          </div>

          <div className="flex items-center justify-end gap-3 md:gap-4 flex-shrink-0">
            <CartIcon />

            <ClerkLoaded>
              <SignedIn>
                <Link
                  href="/orders"
                  aria-label="View my orders"
                  className="group relative"
                >
                  <ListOrdered className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
                  <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                    {orders?.length ?? 0}
                  </span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold hover:text-darkColor hoverEffect">
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </Container>
      </div>

      <div className="hidden md:block border-b border-b-gray-200 bg-white py-2">
        <Container>
          <HeaderMenu categories={categories as CATEGORIES_QUERYResult} />
        </Container>
      </div>
    </header>
  );
};

export default Header;
