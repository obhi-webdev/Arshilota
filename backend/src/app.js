const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,

    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    success: true,

    message: "Arshilota Backend API Running",
  });
});

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: "API route পাওয়া যায়নি।",
  });
});

module.exports = app;
