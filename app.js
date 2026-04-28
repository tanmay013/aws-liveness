const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const livenessRoutes = require("./src/routes/livenessRoutes");
const { requestLogger } = require("./src/middleware/requestLogger");
const { apiRateLimiter } = require("./src/middleware/rateLimiter");
const { notFoundHandler, errorHandler } = require("./src/utils/errorHandler");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  "http://localhost",
  "http://localhost:8100",
  "http://localhost:5173",
  "capacitor://localhost",
  "ionic://localhost"
];

const originAllowList = new Set(
  isProduction ? allowedOrigins : [...allowedOrigins, ...defaultDevOrigins]
);

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  if (originAllowList.has("*") || originAllowList.has(origin)) {
    return true;
  }

  if (!isProduction) {
    try {
      const parsed = new URL(origin);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  return false;
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    optionsSuccessStatus: 204
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "face-liveness-backend",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRateLimiter, livenessRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
