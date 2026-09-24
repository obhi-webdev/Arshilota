import { useState } from "react";

import { ZoomIn } from "lucide-react";

import product from "../data/product";

const ProductGallery = () => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <section id="gallery" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">
            Product Details
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            শাড়িটি কাছ থেকে দেখুন
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            কাপড়, ডিজাইন ও ফিনিশিং সম্পর্কে পরিষ্কার ধারণা পেতে প্রতিটি ছবি
            দেখুন।
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[110px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto pb-2 lg:order-1 lg:flex-col lg:overflow-visible">
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition ${
                  selectedImage === image
                    ? "border-brand-700"
                    : "border-transparent hover:border-brand-200"
                }`}
              >
                <img
                  src={image}
                  alt={`Saree ${index + 1}`}
                  className="h-24 w-20 rounded-lg object-cover lg:h-28 lg:w-full"
                />
              </button>
            ))}
          </div>

          <div className="group relative order-1 overflow-hidden rounded-[32px] bg-brand-50 lg:order-2">
            <img
              src={selectedImage}
              alt={product.name}
              className="mx-auto max-h-[760px] min-h-[420px] w-full object-contain transition duration-500 group-hover:scale-[1.015]"
            />

            <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur">
              <ZoomIn size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
