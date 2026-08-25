import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { router } from "./routes/jobRoutes.js";
import { customerRoutes } from "./routes/customerRoutes.js";
import { shopRoutes } from "./routes/shopRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimit.js";
import { prisma } from "./config/db.js";

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
  process.exit(1);
}

const app = express();

app.set("trust proxy", 1);

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : null;
app.use(cors(corsOrigins ? { origin: corsOrigins } : {}));
app.use(express.json());
app.use(globalLimiter);

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/jobs", router);

app.use("/api/customers", customerRoutes);

app.use("/api/shops", shopRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Kostody API is running...");
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    return res.status(503).json({ status: "degraded" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
