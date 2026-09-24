import { BadgeCheck, Banknote, PackageCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Quality Checked",
    text: "পাঠানোর আগে প্রতিটি শাড়ি যাচাই করা হয়।",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "বাংলাদেশের যেকোনো জেলায় ডেলিভারি।",
  },
  {
    icon: Banknote,
    title: "Flexible Payment",
    text: "COD অথবা bKash/Nagad-এর মাধ্যমে পেমেন্ট।",
  },
  {
    icon: PackageCheck,
    title: "Safe Order",
    text: "Order ও payment information নিরাপদে সংরক্ষিত থাকে।",
  },
];

const TrustSection = () => {
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[28px] border border-gray-100 bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white p-6 transition hover:bg-brand-50 sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon size={22} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
