import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
];

/* -------------------------------------------------------
   CORS CONFIG (PATCH + SAFE FOR EXPRESS v5)
-------------------------------------------------------*/
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------------------------------------------
   UNIVERSAL OPTIONS HANDLER — EXPRESS v5 SAFE
-------------------------------------------------------*/
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

/* -------------------------------------------------------
   ROUTES
-------------------------------------------------------*/
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* -------------------------------------------------------
   GLOBAL ERROR HANDLER
-------------------------------------------------------*/
app.use((err, req, res, next) => {
  console.error("❌ Error details:", {
    message: err.message,
    stack: err.stack,
    query: err.query,
  });

  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("👉 CORS allowed for:", allowedOrigins);
  });
}

export default app;
