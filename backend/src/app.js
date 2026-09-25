const express = require("express");

const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route পাওয়া যায়নি।",
  });
});

module.exports = app;
