"use client";

import React, { useState } from "react";
import { AlignLeft } from "lucide-react";

import { CATEGORIES_QUERYResult } from "@/sanity.types";
import Sidebar from "./Sidebar";

interface MobileMenuProps {
  categories: CATEGORIES_QUERYResult;
}

const MobileMenu = ({ categories }: MobileMenuProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden p-2 -ml-2"
        aria-label="Open menu"
      >
        <AlignLeft className="w-6 h-6 hover:text-darkColor hoverEffect" />
      </button>

      <div className="md:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={categories}
        />
      </div>
    </>
  );
};

export default MobileMenu;
