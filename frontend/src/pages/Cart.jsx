import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import product from "../data/product";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[72vh] items-center justify-center bg-brand-50 px-4 py-16">
          <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <ShoppingBag size={34} />
            </div>

            <h1 className="mt-6 text-3xl font-bold">আপনার Cart খালি</h1>

            <p className="mt-3 text-gray-500">
              পছন্দের শাড়িটি Cart-এ যোগ করুন।
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-xl bg-brand-700 px-7 py-3 font-semibold text-white"
            >
              শাড়ি দেখুন
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const deliveryCharge = product.deliveryCharge;

  const total = subtotal + deliveryCharge;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-50 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600"
          >
            <ArrowLeft size={17} />
            Shopping চালিয়ে যান
          </Link>

          <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
            <section>
              <h1 className="mb-6 text-3xl font-bold text-gray-950">
                Shopping Cart
              </h1>

              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-28 w-24 shrink-0 rounded-xl object-cover sm:h-36 sm:w-28"
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <h2 className="text-sm font-semibold leading-6 text-gray-900 sm:text-lg">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-xl font-bold text-brand-700">
                        ৳{item.price}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-9 w-9 items-center justify-center"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-9 text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>৳{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>

                  <span>৳{deliveryCharge}</span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>

                <span className="text-3xl font-bold text-brand-700">
                  ৳{total}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-brand-700 py-4 text-lg font-semibold text-white transition hover:bg-brand-800"
              >
                Checkout
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Cart;
