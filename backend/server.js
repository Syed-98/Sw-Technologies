const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/authRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const newsletterRoutes = require("./src/routes/newsletterRoutes");
const quoteRoutes = require("./src/routes/quoteRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      const normalizedOrigin = origin ? origin.replace(/\/$/, "") : "";
      const isLocalhost =
        /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin);

      if (!origin || isLocalhost || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      // Reject CORS quietly so requests do not become a 500 server error.
      return callback(null, false);
    },
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/admin", adminRoutes);

// Optional static hosting for local full-stack run
app.use(express.static(path.resolve(__dirname, "..")));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

async function startServer() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
