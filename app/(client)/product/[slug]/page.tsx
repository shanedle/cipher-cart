import React from "react";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { getProductBySlug } from "@/sanity/helpers";

const TEXT = {
  IN_STOCK: "In Stock",
  FREE_SHIPPING_TITLE: "Free Shipping",
  FREE_SHIPPING_DESCRIPTION: "Free shipping over order $120",
  FLEXIBLE_PAYMENT_TITLE: "Flexible Payment",
  FLEXIBLE_PAYMENT_DESCRIPTION: "Pay with Multiple Credit Cards",
};

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
    return null;
  }

  const { name, images, price, discount, stock, description } = product;

  return (
    <Container className="py-10 flex flex-col md:flex-row gap-10">
      {images && images.length > 0 && <ImageView images={images} />}

      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {name || "Product Title"}
          </h2>
          <PriceView
            price={price}
            discount={discount}
            className="text-lg font-bold"
          />
        </div>

        {stock && stock > 0 && (
          <p className="bg-green-100 w-fit px-4 text-center text-green-600 text-sm py-2.5 font-semibold rounded-lg">
            {TEXT.IN_STOCK}
          </p>
        )}

        {description && (
          <p className="text-sm text-gray-600 tracking-wide">{description}</p>
        )}

        <div className="flex items-center gap-2.5 lg:gap-5">
          <AddToCartButton
            product={product}
            className="bg-darkColor/80 text-white hover:bg-darkColor hoverEffect"
          />
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue rounded-md hoverEffect">
            <p className="text-base font-semibold text-darkColor">
              {TEXT.FREE_SHIPPING_TITLE}
            </p>
            <p className="text-sm text-gray-500">
              {TEXT.FREE_SHIPPING_DESCRIPTION}
            </p>
          </div>

          <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue rounded-md hoverEffect">
            <p className="text-base font-semibold text-darkColor">
              {TEXT.FLEXIBLE_PAYMENT_TITLE}
            </p>
            <p className="text-sm text-gray-500">
              {TEXT.FLEXIBLE_PAYMENT_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
