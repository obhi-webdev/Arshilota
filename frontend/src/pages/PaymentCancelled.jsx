import { CircleX } from "lucide-react";

import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <CircleX size={42} />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Payment Cancelled</h1>

        <p className="mt-3 text-gray-500">
          আপনি Payment process cancel করেছেন।
        </p>

        <Link
          to="/checkout"
          className="mt-7 inline-flex rounded-xl bg-brand-700 px-7 py-3 font-semibold text-white"
        >
          Checkout-এ ফিরে যান
        </Link>
      </div>
    </main>
  );
};

export default PaymentCancelled;
