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

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
  process.exit(1);
}

const app = express();

app.use(cors());
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
