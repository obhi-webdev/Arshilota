import { MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#251719] pb-24 pt-14 text-white lg:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <img src="/images/logo.png" alt="আরশীলতা" className="h-14 w-auto" />

            <p className="mt-4 max-w-md text-sm leading-7 text-white/60">
              পছন্দসই শাড়ি খুঁজুন আরশীলতায়। সুন্দর ডিজাইন, উন্নত মান এবং
              নির্ভরযোগ্য অর্ডার অভিজ্ঞতা।
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Quick Links</h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              <a href="#product" className="block transition hover:text-white">
                Product
              </a>

              <a href="#gallery" className="block transition hover:text-white">
                Gallery
              </a>

              <a href="#faq" className="block transition hover:text-white">
                FAQ
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                Customer Support
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={16} />
                Order Assistance
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        <p className="text-center text-xs text-white/40">
          © 2026 Arshilota. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
