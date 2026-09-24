import {
  BadgeCheck,
  Feather,
  Heart,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import product from "../data/product";

const icons = [BadgeCheck, Feather, Heart, ShieldCheck, PackageCheck, Truck];

const ProductBenefits = () => {
  return (
    <section id="features" className="bg-brand-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
              কেন এই শাড়িটি?
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
              সুন্দর ডিজাইনের সাথে
              <br className="hidden lg:block" />
              প্রিমিয়াম কোয়ালিটি
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              {product.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {product.features.map((feature, index) => {
              const Icon = icons[index];

              return (
                <div
                  key={feature}
                  className="group rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <p className="font-semibold leading-6 text-gray-800">
                    {feature}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductBenefits;
