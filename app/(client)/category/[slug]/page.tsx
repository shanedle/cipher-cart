import Container from "@/components/Container";
import CategoryProducts from "@/components/CategoryProducts";
import Title from "@/components/Title";
import { getAllCategories } from "@/sanity/helpers";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const categories = await getAllCategories();

  return (
    <div>
      <Container className="py-10">
        <Title className="text-xl">
          Products by Category:{" "}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {slug && slug}
          </span>
        </Title>

        <CategoryProducts categories={categories} />
      </Container>
    </div>
  );
};

export default CategoryPage;
