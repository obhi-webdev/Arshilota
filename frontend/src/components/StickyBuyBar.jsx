import { ShoppingBag } from "lucide-react";

import { useNavigate } from "react-router-dom";

import product from "../data/product";

import { useCart } from "../context/CartContext";

const StickyBuyBar = () => {
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const buyNow = () => {
    addToCart(product, 1);

    navigate("/checkout");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/[0.05] bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-[95px]">
          <p className="text-[11px] text-gray-500">আজকের মূল্য</p>

          <p className="text-xl font-bold text-brand-700">৳{product.price}</p>
        </div>

        <button
          type="button"
          onClick={buyNow}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 font-semibold text-white"
        >
          <ShoppingBag size={18} />
          এখনই অর্ডার করুন
        </button>
      </div>
    </div>
  );
};

export default StickyBuyBar;
