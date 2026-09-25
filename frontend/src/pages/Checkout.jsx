import { Banknote, Check, LockKeyhole, ShieldCheck } from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import product from "../data/product";

import { useCart } from "../context/CartContext";

import { createCodOrder } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, subtotal } = useCart();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    postcode: "",
    address: "",
  });

  useEffect(() => {
    if (!items.length) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  const deliveryCharge = product.deliveryCharge;

  const total = subtotal + deliveryCharge;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const customer = {
        name: formData.name.trim(),

        phone: formData.phone.trim(),

        email: formData.email.trim(),

        district: formData.district.trim(),

        postcode: formData.postcode.trim(),

        address: formData.address.trim(),
      };

      const response = await createCodOrder({
        customer,
        quantity,
      });

      if (!response?.order?._id) {
        throw new Error("Order তৈরি হয়েছে কিন্তু Order ID পাওয়া যায়নি।");
      }

      navigate(`/payment/success?orderId=${response.order._id}`);
    } catch (err) {
      console.error("COD Order Error:", err);

      setError(err.message || "Order তৈরি করা যায়নি। আবার চেষ্টা করুন।");

      setLoading(false);
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-brand-50 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Heading */}

          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <ShieldCheck size={17} />
              SECURE CHECKOUT
            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
              আপনার অর্ডার কনফার্ম করুন
            </h1>

            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Delivery information দিন এবং Cash on Delivery-তে অর্ডার কনফার্ম
              করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-7 lg:grid-cols-[1fr_400px]"
          >
            <div className="space-y-6">
              {/* Delivery Information */}

              <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold">Delivery Information</h2>

                <p className="mt-2 text-sm text-gray-500">
                  সঠিক তথ্য দিন যেন কুরিয়ার সহজে আপনার কাছে পৌঁছাতে পারে।
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Input
                    label="আপনার নাম"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="সম্পূর্ণ নাম"
                  />

                  <Input
                    label="মোবাইল নম্বর"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required={false}
                  />

                  <Input
                    label="জেলা"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Mymensingh"
                  />

                  <Input
                    label="Post Code"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="2200"
                    required={false}
                  />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      সম্পূর্ণ ঠিকানা
                    </label>

                    <textarea
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="এলাকা, থানা, বাসা/রোড..."
                      className="min-h-28 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                </div>
              </section>

              {/* COD Payment */}

              <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Payment Method</h2>

                    <p className="mt-2 text-sm text-gray-500">
                      পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    Available
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-4 rounded-2xl border-2 border-brand-700 bg-brand-50 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
                      <Banknote size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        পণ্য হাতে পেয়ে টাকা দিন
                      </p>
                    </div>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                      <Check size={15} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                  অর্ডার করতে কোনো advance payment প্রয়োজন নেই। পণ্য হাতে পাওয়ার
                  পর মূল্য পরিশোধ করবেন।
                </div>
              </section>
            </div>

            {/* Order Summary */}

            <aside className="h-fit rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 rounded-xl object-cover"
                      />

                      <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-700 px-1 text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.quantity} × ৳{item.price}
                      </p>

                      <p className="mt-1 font-bold text-brand-700">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-gray-100" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>৳{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>

                  <span>৳{deliveryCharge}</span>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-gray-200" />

              <div className="flex items-end justify-between">
                <span className="font-bold">Total</span>

                <span className="text-3xl font-bold text-brand-700">
                  ৳{total}
                </span>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-6 text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 min-h-14 w-full rounded-xl bg-brand-700 px-5 text-lg font-semibold text-white shadow-lg shadow-brand-700/15 transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Order Processing..."
                  : `অর্ডার কনফার্ম করুন — ৳${total}`}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                <LockKeyhole size={13} />
                Secure Order Submission
              </p>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

const Input = ({ label, required = true, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        required={required}
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
};

export default Checkout;
