import { CheckCircle2, PackageCheck } from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { getOrder } from "../services/api";

import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    getOrder(orderId)
      .then((response) => {
        setOrder(response.order);

        clearCart();
      })
      .catch(() => {
        setOrder(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-brand-200 border-t-brand-700" />

          <p className="mt-4 text-gray-500">Order যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Order পাওয়া যায়নি</h1>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-brand-700 px-6 py-3 text-white"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-[30px] bg-white p-6 text-center shadow-xl shadow-brand-900/5 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          {isPaid ? <CheckCircle2 size={42} /> : <PackageCheck size={42} />}
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          {isPaid ? "Payment Successful!" : "Order Successful!"}
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
          {isPaid
            ? "আপনার পেমেন্ট সফলভাবে যাচাই হয়েছে এবং অর্ডারটি কনফার্ম হয়েছে।"
            : "আপনার Cash on Delivery অর্ডার সফলভাবে গ্রহণ করা হয়েছে।"}
        </p>

        <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left">
          <OrderRow label="Order ID" value={order.orderNumber} />

          <OrderRow label="Amount" value={`৳${order.total}`} />

          <OrderRow
            label="Payment"
            value={
              order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Online Payment"
            }
          />

          <OrderRow label="Payment Status" value={order.paymentStatus} />

          <OrderRow label="Order Status" value={order.orderStatus} last />
        </div>

        <Link
          to="/"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 py-4 font-semibold text-white"
        >
          Home-এ ফিরে যান
        </Link>
      </div>
    </main>
  );
};

const OrderRow = ({ label, value, last }) => {
  return (
    <div
      className={`flex justify-between gap-4 py-3 text-sm ${
        last ? "" : "border-b border-gray-200"
      }`}
    >
      <span className="text-gray-500">{label}</span>

      <span className="text-right font-semibold capitalize">{value}</span>
    </div>
  );
};

export default PaymentSuccess;
