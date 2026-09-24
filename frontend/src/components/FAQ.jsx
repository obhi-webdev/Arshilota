import { ChevronDown } from "lucide-react";

import { useState } from "react";

const faqItems = [
  {
    question: "Cash on Delivery আছে?",
    answer:
      "হ্যাঁ। আপনি পণ্য হাতে পেয়ে Cash on Delivery-এর মাধ্যমে মূল্য পরিশোধ করতে পারবেন।",
  },
  {
    question: "bKash বা Nagad-এ পেমেন্ট করা যাবে?",
    answer:
      "হ্যাঁ। Checkout page থেকে bKash বা Nagad Personal payment option নির্বাচন করে Send Money করতে পারবেন।",
  },
  {
    question: "Payment কীভাবে verify হবে?",
    answer:
      "Sender Number এবং Transaction ID submit করার পর payment manually verify করা হবে। Verification complete হলে order confirm করা হবে।",
  },
  {
    question: "সারাদেশে ডেলিভারি আছে?",
    answer:
      "হ্যাঁ। বাংলাদেশের বিভিন্ন জেলায় কুরিয়ারের মাধ্যমে পণ্য পাঠানো হবে।",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-brand-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-700">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-950 sm:text-4xl">
            সাধারণ কিছু প্রশ্ন
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold sm:p-6"
                >
                  <span>{item.question}</span>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-7 text-gray-600 sm:px-6 sm:pb-6">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
