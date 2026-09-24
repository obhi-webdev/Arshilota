import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentSubmitted from "./pages/PaymentSubmitted";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentCancelled from "./pages/PaymentCancelled";

import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={<Checkout />} />

      <Route path="/payment/success" element={<PaymentSuccess />} />

      <Route path="/payment/submitted" element={<PaymentSubmitted />} />

      <Route path="/payment/failed" element={<PaymentFailed />} />

      <Route path="/payment/cancelled" element={<PaymentCancelled />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
