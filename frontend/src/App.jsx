import { Route, Routes } from "react-router-dom";

import MetaPixel from "./components/MetaPixel";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <MetaPixel />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment/success" element={<PaymentSuccess />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
