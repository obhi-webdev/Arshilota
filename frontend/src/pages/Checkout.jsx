import {
  Banknote,
  Check,
  Copy,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import product from "../data/product";
import paymentMethods from "../data/paymentMethods";

import { useCart } from "../context/CartContext";

import { createCodOrder, createManualPaymentOrder } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const { items, subtotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    postcode: "",
    address: "",
  });

  const [paymentData, setPaymentData] = useState({
    senderPhone: "",
    transactionId: "",
  });

  useEffect(() => {
    if (!items.length) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  const deliveryCharge = product.deliveryCharge;

  const total = subtotal + deliveryCharge;

  const selectedWallet =
    paymentMethod !== "cod" ? paymentMethods[paymentMethod] : null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;

    setPaymentData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const copyNumber = async (number, method) => {
    try {
      await navigator.clipboard.writeText(number);

      setCopied(method);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setCopied("");
    }
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

      if (paymentMethod === "cod") {
        const response = await createCodOrder({
          customer,
          quantity,
        });

        navigate(`/payment/success?orderId=${response.order._id}`);

        return;
      }

      if (!paymentData.senderPhone.trim()) {
        throw new Error("যে নম্বর থেকে payment করেছেন সেই নম্বরটি দিন।");
      }

      if (!paymentData.transactionId.trim()) {
        throw new Error("Transaction ID দিন।");
      }

      const response = await createManualPaymentOrder({
        customer,
        quantity,

        paymentMethod: selectedWallet.id,

        senderPhone: paymentData.senderPhone.trim(),

        transactionId: paymentData.transactionId.trim().toUpperCase(),
      });

      navigate(`/payment/submitted?orderId=${response.order._id}`);
    } catch (err) {
      setError(err.message || "Order submit করা যায়নি।");

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
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <ShieldCheck size={17} />
              SECURE CHECKOUT
            </div>

            <h1 className="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">
              আপনার অর্ডার কনফার্ম করুন
            </h1>

            <p className="mt-3 text-sm text-gray-500 sm:text-base">
              Delivery information দিন এবং আপনার পছন্দের payment method নির্বাচন
              করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-7 lg:grid-cols-[1fr_400px]"
          >
            <div className="space-y-6">
              {/* Delivery */}

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
                      className="min-h-28 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}

              <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold">Payment Method</h2>

                <p className="mt-2 text-sm text-gray-500">
                  আপনার সুবিধামতো পেমেন্ট পদ্ধতি নির্বাচন করুন।
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    active={paymentMethod === "cod"}
                    onClick={() => setPaymentMethod("cod")}
                    title="Cash on Delivery"
                    subtitle="পণ্য হাতে পেয়ে টাকা দিন"
                    icon={<Banknote size={21} />}
                  />

                  <PaymentOption
                    active={paymentMethod === "bkash"}
                    onClick={() => setPaymentMethod("bkash")}
                    title="bKash"
                    subtitle="Personal Send Money"
                    icon={<Smartphone size={21} />}
                  />

                  <PaymentOption
                    active={paymentMethod === "nagad"}
                    onClick={() => setPaymentMethod("nagad")}
                    title="Nagad"
                    subtitle="Personal Send Money"
                    icon={<Smartphone size={21} />}
                  />

                  <PaymentOption
                    active={paymentMethod === "rocket"}
                    onClick={() => setPaymentMethod("rocket")}
                    title="Rocket"
                    subtitle="Personal Send Money"
                    icon={<Smartphone size={21} />}
                  />
                </div>

                {selectedWallet && (
                  <div className="mt-6 overflow-hidden rounded-2xl border border-brand-200 bg-brand-50">
                    <div className="border-b border-brand-100 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                        Send Money
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {selectedWallet.name} Personal
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-gray-500">
                          Send Money Number
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                          <strong className="text-xl text-brand-700 sm:text-2xl">
                            {selectedWallet.number}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              copyNumber(selectedWallet.number, paymentMethod)
                            }
                            className="flex items-center gap-2 rounded-lg bg-brand-100 px-3 py-2 text-sm font-semibold text-brand-700"
                          >
                            <Copy size={15} />

                            {copied === paymentMethod ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm leading-7 text-gray-600">
                        <p>
                          1. উপরের নম্বরে <strong>Send Money</strong> করুন।
                        </p>

                        <p>
                          2. Amount:{" "}
                          <strong className="text-lg text-brand-700">
                            ৳{total}
                          </strong>
                        </p>

                        <p>
                          3. Payment complete হলে Sender Number ও Transaction ID
                          দিন।
                        </p>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Input
                          label="Sender Number"
                          name="senderPhone"
                          type="tel"
                          value={paymentData.senderPhone}
                          onChange={handlePaymentChange}
                          placeholder="01XXXXXXXXX"
                        />

                        <Input
                          label="Transaction ID"
                          name="transactionId"
                          value={paymentData.transactionId}
                          onChange={handlePaymentChange}
                          placeholder="Example: ABC12XYZ"
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
                        Payment submit করার পর manually verify করা হবে।
                        Verification complete হওয়ার আগে payment successful
                        হিসেবে গণ্য হবে না।
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Summary */}

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
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 min-h-14 w-full rounded-xl bg-brand-700 px-5 text-lg font-semibold text-white shadow-lg shadow-brand-700/15 transition hover:bg-brand-800 disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "cod"
                    ? "অর্ডার কনফার্ম করুন"
                    : `Payment Submit করুন — ৳${total}`}
              </button>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
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

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        required
        {...props}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
};

const PaymentOption = ({ active, onClick, icon, title, subtitle }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
        active
          ? "border-brand-700 bg-brand-50"
          : "border-gray-100 hover:border-brand-200"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          active ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>

        <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
      </div>

      {active && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check size={14} />
        </div>
      )}
    </button>
  );
};

export default Checkout;
