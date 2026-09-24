import { XCircle } from "lucide-react";

import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-red-50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={42} />
        </div>

        <h1 className="mt-6 text-3xl font-bold">Payment Failed</h1>

        <p className="mt-3 leading-7 text-gray-500">
          পেমেন্ট সফল হয়নি। আপনার অর্ডার Paid হিসেবে কনফার্ম করা হয়নি।
        </p>

        <Link
          to="/checkout"
          className="mt-7 inline-flex rounded-xl bg-brand-700 px-7 py-3 font-semibold text-white"
        >
          আবার চেষ্টা করুন
        </Link>
      </div>
    </main>
  );
};

export default PaymentFailed;
