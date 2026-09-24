import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGallery from "../components/ProductGallery";
import ProductBenefits from "../components/ProductBenefits";
import TrustSection from "../components/TrustSection";
import FAQ from "../components/FAQ";
import StickyBuyBar from "../components/StickyBuyBar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <ProductGallery />

        <ProductBenefits />

        <TrustSection />

        <FAQ />
      </main>

      <Footer />

      <StickyBuyBar />
    </>
  );
};

export default Home;
