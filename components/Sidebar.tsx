import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import Link from "next/link";
import { useOutsideClick } from "@/hooks";
import SocialMedia from "./SocialMedia";
import { CATEGORIES_QUERYResult } from "@/sanity.types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CATEGORIES_QUERYResult;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, categories }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-full bg-darkColor/50 shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform ease-in-out duration-300`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-darkColor h-full text-primary-foreground p-10 border-r border-r-hoverColor/30 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <Logo className="text-white">Cipher Cart</Logo>
          <button
            onClick={onClose}
            className="hover:text-red-500 hoverEffect cursor-pointer"
          >
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-3.5 text-base font-semibold tracking-wide text-zinc-400">
          <Link
            onClick={onClose}
            href={"/"}
            className={`hover:text-white hoverEffect ${
              pathname === `/` && "text-white"
            }`}
          >
            Home
          </Link>
          {categories?.map((item) => (
            <Link
              onClick={onClose}
              key={item?.title}
              href={`/category/${item?.slug?.current}`}
              className={`hover:text-white hoverEffect ${
                pathname === `/category/${item?.slug?.current}` && "text-white"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>
        <SocialMedia />
      </motion.div>
    </div>
  );
};

export default Sidebar;
