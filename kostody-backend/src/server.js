import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { router } from "./routes/jobRoutes.js";
import { customerRoutes } from "./routes/customerRoutes.js";
import { shopRoutes } from "./routes/shopRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/jobs", router);

app.use("/api/customers", customerRoutes);

app.use("/api/shops", shopRoutes);

app.get("/", (req, res) => {
  res.send("Kostody API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
