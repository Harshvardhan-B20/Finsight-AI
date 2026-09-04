const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ========================================
// CORS
// ========================================

// Allow any localhost port.
// Vite can automatically move between ports
// when another development server is already running.
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && /^http:\/\/localhost:\d+$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Authorization"
  );

  // Browser CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.status(200).send("FinSight AI Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "FinSight AI API is working",
  });
});

// ========================================
// API ROUTES
// ========================================

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const reconciliationRoutes = require("./routes/reconciliationRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/ai", aiRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FinSight AI Backend running on port ${PORT}`);
});