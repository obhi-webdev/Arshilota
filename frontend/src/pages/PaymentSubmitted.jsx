import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getOrder } from "../services/api";
import { useCart } from "../context/CartContext";

const PaymentSubmitted = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setError("Order ID পাওয়া যায়নি।");

      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await getOrder(orderId);

        setOrder(response.order);

        // Order successfully পাওয়া গেলে
        // তখন cart clear হবে
        clearCart();
      } catch (err) {
        setError(err.message || "Order পাওয়া যায়নি।");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" />

          <p className="mt-4 text-gray-500">
            Payment information load হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Order পাওয়া যায়নি</h1>

          <p className="mt-3 text-gray-500">{error}</p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white"
          >
            Home
          </Link>
        </div>
      </main>
    );
  }

  const paymentMethodName = {
    BKASH_PERSONAL: "bKash Personal",

    NAGAD_PERSONAL: "Nagad Personal",

    ROCKET_PERSONAL: "Rocket Personal",
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-[30px] bg-white p-7 text-center shadow-xl shadow-brand-900/5 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Clock3 size={40} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-950">
          Payment Submitted
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
          আপনার payment information গ্রহণ করা হয়েছে। Payment manually verify
          করার পর আপনার order confirm করা হবে।
        </p>

        <div className="mt-8 rounded-2xl bg-gray-50 p-5 text-left">
          <OrderRow label="Order ID" value={order.orderNumber} />

          <OrderRow label="Amount" value={`৳${order.total}`} />

          <OrderRow
            label="Payment Method"
            value={
              paymentMethodName[order.paymentMethod] || order.paymentMethod
            }
          />

          <OrderRow
            label="Sender Number"
            value={order.manualPayment?.senderPhone || "-"}
          />

          <OrderRow
            label="Transaction ID"
            value={order.manualPayment?.transactionId || "-"}
          />

          <OrderRow label="Payment Status" value="Verification Pending" />

          <OrderRow label="Order Status" value={order.orderStatus} last />
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          আপনার payment verify হওয়ার আগ পর্যন্ত order confirmed হিসেবে গণ্য হবে
          না।
        </div>

        <Link
          to="/"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-brand-700 py-4 font-semibold text-white transition hover:bg-brand-800"
        >
          Home-এ ফিরে যান
        </Link>
      </div>
    </main>
  );
};

const OrderRow = ({ label, value, last = false }) => {
  return (
    <div
      className={`flex justify-between gap-4 py-3 text-sm ${
        last ? "" : "border-b border-gray-200"
      }`}
    >
      <span className="text-gray-500">{label}</span>

      <strong className="max-w-[60%] break-all text-right capitalize text-gray-900">
        {value}
      </strong>
    </div>
  );
};

export default PaymentSubmitted;
