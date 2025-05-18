"use client";

import Container from "@/components/Container";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";

import { urlFor } from "@/sanity/lib/image";
import useCartStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyCart from "@/components/EmptyCart";
import NoAccessToCart from "@/components/NoAccessToCart";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loading from "@/components/Loading";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";

const TEXT = {
  PAGE_TITLE: "Shopping Cart",
  EMPTY_CART: "Empty Cart",
  COLUMN_QUANTITY: "Quantity",
  COLUMN_PRICE: "Price",
  COLUMN_TOTAL: "Total",
  COLUMN_DELETE: "Remove",
  PRODUCT_STOCK: (count: number | string) => `${count} in stock`,
  SUMMARY_SUBTOTAL: "Total:",
  SUMMARY_DISCOUNT: "Total Discount:",
  SUMMARY_TOTAL: "Total to Pay:",
  CHECKOUT_BUTTON: "PROCEED TO CHECKOUT",
  PROCESSING: "Processing...",
  DELETE_ITEM_TOOLTIP: "Remove product",
  RESET_CART_CONFIRM_TITLE: "Empty Your Cart?",
  RESET_CART_CONFIRM_DESC:
    "Are you sure you want to remove all items from your shopping cart?",
  DELETE_ITEM_CONFIRM_TITLE: "Remove Item?",
  DELETE_ITEM_CONFIRM_DESC:
    "Are you sure you want to remove this item from your cart?",
  CANCEL: "Cancel",
  CONFIRM_DELETE: "Yes, Remove",
  CONFIRM_EMPTY: "Yes, Empty Cart",
  TOAST_CART_RESET_SUCCESS: "Your cart has been emptied!",
  TOAST_PRODUCT_DELETE_SUCCESS: "Product removed from cart.",
  TOAST_CHECKOUT_ERROR: "Checkout failed. Please try again later.",
};

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
    getGroupedItems,
  } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cartProducts = getGroupedItems();
  const subtotal = getSubTotalPrice();
  const total = getTotalPrice();
  const discount = subtotal - total;

  const handleConfirmResetCart = () => {
    resetCart();
    toast.success(TEXT.TOAST_CART_RESET_SUCCESS);
    setIsResetDialogOpen(false);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setItemToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteProduct = () => {
    if (itemToDeleteId) {
      deleteCartProduct(itemToDeleteId);
      toast.success(TEXT.TOAST_PRODUCT_DELETE_SUCCESS);
      setItemToDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) return;
    setIsCheckingOut(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user.fullName ?? "Unknown Customer",
        customerEmail: user.primaryEmailAddress?.emailAddress ?? "No Email",
        clerkUserId: user.id,
      };

      const checkoutUrl = await createCheckoutSession(cartProducts, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Checkout URL was not generated.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(TEXT.TOAST_CHECKOUT_ERROR);
      setIsCheckingOut(false);
    }
  };

  if (!isClient) return <Loading />;
  if (!isSignedIn) return <NoAccessToCart />;
  if (cartProducts?.length === 0 && isClient) return <EmptyCart />;

  return (
    <div className="bg-white pb-10">
      <Container>
        <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {TEXT.PAGE_TITLE}
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            <AlertDialog
              open={isResetDialogOpen}
              onOpenChange={setIsResetDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button className="text-sm text-gray-600 hover:text-red-600">
                  {TEXT.EMPTY_CART}
                </button>
              </AlertDialogTrigger>
              <AlertDialogPortal>
                <AlertDialogOverlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
                <AlertDialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50 focus:outline-none">
                  <AlertDialogTitle className="text-lg font-medium text-gray-900 m-0">
                    {TEXT.RESET_CART_CONFIRM_TITLE}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 mt-2 mb-5 text-sm leading-normal">
                    {TEXT.RESET_CART_CONFIRM_DESC}
                  </AlertDialogDescription>
                  <div className="flex justify-end gap-3">
                    <AlertDialogCancel asChild>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors">
                        {TEXT.CANCEL}
                      </button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button
                        onClick={handleConfirmResetCart}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      >
                        {TEXT.CONFIRM_EMPTY}
                      </button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow lg:w-2/3">
            <div className="hidden md:grid grid-cols-[1fr_7rem_7rem_8rem_4rem] text-xs text-gray-500 uppercase border-b border-gray-200 pb-2 mb-3">
              <div></div>
              <div className="text-center">{TEXT.COLUMN_QUANTITY}</div>
              <div className="text-right">{TEXT.COLUMN_PRICE}</div>
              <div className="text-right">{TEXT.COLUMN_TOTAL}</div>
              <div className="text-right">{TEXT.COLUMN_DELETE}</div>
            </div>

            {cartProducts?.map(({ product }, idx) => {
              const itemCount = getItemCount(product?._id);
              const unitPrice = product?.price as number;
              const lineItemTotal = unitPrice * itemCount;
              const showTotalDiscount = idx === 0 && discount > 0;

              return (
                <div
                  key={product?._id}
                  className="flex flex-col md:grid md:grid-cols-[1fr_7rem_7rem_8rem_4rem] items-start md:items-center py-4 border-b border-gray-200 gap-3 md:gap-0"
                >
                  <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    {product?.images && (
                      <Link
                        href={`/product/${product?.slug?.current}`}
                        className="flex-shrink-0"
                      >
                        <Image
                          src={urlFor(product?.images[0]).url()}
                          alt={product?.name ?? "Product Image"}
                          width={80}
                          height={80}
                          className="border border-gray-200 rounded"
                        />
                      </Link>
                    )}
                    <div className="text-sm">
                      <Link
                        href={`/product/${product?.slug?.current}`}
                        className="font-semibold text-gray-800 hover:text-blue-600 block mb-1"
                      >
                        {product?.name}
                      </Link>
                      <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                        {product?.intro}
                      </p>
                      {product?.stock && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {TEXT.PRODUCT_STOCK(product.stock)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex justify-start md:justify-center">
                    <QuantityButtons product={product} />
                  </div>

                  <div className="w-full md:w-auto text-left md:text-right text-sm font-medium flex items-center md:justify-end">
                    <span className="md:hidden text-xs text-gray-500 mr-2">
                      {TEXT.COLUMN_PRICE}:{" "}
                    </span>
                    <PriceFormatter amount={unitPrice} />
                  </div>

                  <div className="w-full md:w-auto text-left md:text-right text-sm font-semibold flex flex-col items-start md:items-end">
                    <span className="md:hidden text-xs text-gray-500 mr-2">
                      {TEXT.COLUMN_TOTAL}:{" "}
                    </span>
                    <PriceFormatter amount={lineItemTotal} />
                    {showTotalDiscount && (
                      <div className="inline-block text-xs text-red-600 bg-red-100 px-2 py-1 rounded mt-2 font-medium text-center">
                        Total Discount:
                        <br />
                        <span className="font-bold">
                          <PriceFormatter amount={discount} />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-auto flex justify-end pt-2 md:pt-0">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleOpenDeleteDialog(product?._id)}
                            aria-label={TEXT.DELETE_ITEM_TOOLTIP}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          sideOffset={5}
                          className="text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-md"
                        >
                          {TEXT.DELETE_ITEM_TOOLTIP}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:w-1/3 lg:sticky lg:top-6 self-start">
            <div className="bg-gray-50 p-4 md:p-6 rounded-md border border-gray-200 shadow-sm">
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>{TEXT.SUMMARY_SUBTOTAL}</span>
                  <PriceFormatter amount={subtotal} />
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-600 bg-red-100 px-2 py-1 rounded">
                    <span>{TEXT.SUMMARY_DISCOUNT}</span>
                    <span>
                      -<PriceFormatter amount={discount} />
                    </span>
                  </div>
                )}
                <hr className="border-gray-200 !my-3" />
                <div className="flex justify-between items-center text-base font-semibold text-gray-900">
                  <span>{TEXT.SUMMARY_TOTAL}</span>
                  <PriceFormatter amount={total} className="text-lg" />
                </div>
              </div>
              <button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                className="w-full px-4 py-3 bg-black text-white text-base font-bold rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {TEXT.PROCESSING}
                  </>
                ) : (
                  TEXT.CHECKOUT_BUTTON
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[-2px_0px_10px_rgba(0,0,0,0.1)] z-30 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{TEXT.SUMMARY_TOTAL}</span>
            <PriceFormatter
              amount={total}
              className="text-lg font-bold text-black"
            />
          </div>
          <button
            disabled={isCheckingOut}
            onClick={handleCheckout}
            className="w-full px-4 py-3 bg-black text-white text-base font-bold rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {TEXT.PROCESSING}
              </>
            ) : (
              TEXT.CHECKOUT_BUTTON
            )}
          </button>
        </div>
      </Container>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogPortal>
          <AlertDialogOverlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <AlertDialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg z-50 focus:outline-none">
            <AlertDialogTitle className="text-lg font-medium text-gray-900 m-0">
              {TEXT.DELETE_ITEM_CONFIRM_TITLE}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 mt-2 mb-5 text-sm leading-normal">
              {TEXT.DELETE_ITEM_CONFIRM_DESC}
            </AlertDialogDescription>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel asChild>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors">
                  {TEXT.CANCEL}
                </button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <button
                  onClick={handleConfirmDeleteProduct}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  {TEXT.CONFIRM_DELETE}
                </button>
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
};

export default CartPage;
