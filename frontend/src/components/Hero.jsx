import { Check, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import product from "../data/product";

import { useCart } from "../context/CartContext";

const Hero = () => {
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const discount = product.regularPrice - product.price;

  const buyNow = () => {
    addToCart(product, quantity);

    navigate("/checkout");
  };

  return (
    <section id="product" className="relative overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-brand-100/80 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-200/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        {/* IMAGE */}

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="overflow-hidden rounded-[32px] border border-white bg-white p-2 shadow-[0_24px_80px_rgba(70,30,30,0.12)]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-[4/5] w-full rounded-[26px] object-cover"
            />
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-900">Premium Quality</p>

                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  উন্নত মানের কাপড় ও সুন্দর ফিনিশিং
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            <Sparkles size={15} />
            পূজো নতুন কালেকশন
          </div>

          <h1 className="mt-6 max-w-2xl text-[39px] font-bold leading-[1.12] tracking-tight text-gray-950 sm:text-5xl lg:text-[60px]">
            {product.name}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            {product.tagline}
          </p>

          {/* Price */}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="text-4xl font-bold tracking-tight text-brand-700 sm:text-5xl">
              ৳{product.price}
            </span>

            <span className="text-xl text-gray-400 line-through">
              ৳{product.regularPrice}
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
              SAVE ৳{discount}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-amber-700">
            Limited Stock — মাত্র {product.stock}টি বাকি
          </p>

          {/* Trust */}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              "Cash on Delivery",
              "bKash / Nagad Payment",
              "সারাদেশে ডেলিভারি",
              "Quality Checked",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check size={12} />
                </span>

                {item}
              </div>
            ))}
          </div>

          {/* Quantity + Cart */}

          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex shrink-0 items-center rounded-xl border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(value - 1, 1))}
                className="flex h-11 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 sm:w-11"
              >
                <Minus size={17} />
              </button>

              <span className="w-10 text-center text-lg font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(value + 1, 10))}
                className="flex h-11 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 sm:w-11"
              >
                <Plus size={17} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product, quantity)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-700 bg-white px-5 font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
          </div>

          <button
            type="button"
            onClick={buyNow}
            className="mt-4 flex min-h-14 w-full items-center justify-center rounded-xl bg-brand-700 px-6 text-lg font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:-translate-y-0.5 hover:bg-brand-800"
          >
            এখনই অর্ডার করুন
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-gray-500 sm:text-left sm:text-sm">
            Cash on Delivery অথবা Personal bKash/Nagad-এর মাধ্যমে অর্ডার করতে
            পারবেন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
