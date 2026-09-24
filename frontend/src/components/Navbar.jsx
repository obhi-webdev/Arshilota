import { ShoppingBag } from "lucide-react";

import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="আরশীলতা"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#product"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-700"
          >
            শাড়ি
          </a>

          <a
            href="#gallery"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-700"
          >
            গ্যালারি
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-700"
          >
            বৈশিষ্ট্য
          </a>

          <a
            href="#faq"
            className="text-sm font-medium text-gray-600 transition hover:text-brand-700"
          >
            FAQ
          </a>
        </nav>

        <Link
          to="/cart"
          className="relative flex h-11 items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 text-sm font-semibold text-brand-800 transition hover:border-brand-200 hover:bg-brand-100"
        >
          <ShoppingBag size={18} />

          <span className="hidden sm:block">Cart</span>

          {cartCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[11px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
