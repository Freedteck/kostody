import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };

export const requireShopParam = (req, res, next) => {
  if (req.params.shopId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

export const requireCustomerParam = (req, res, next) => {
  if (req.params.customerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};

export const overrideBodyShopId = (req, res, next) => {
  req.body = { ...req.body, shopId: req.user.id };
  return next();
};

export const authorizeJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.jobId },
      select: { id: true, shopId: true, customerId: true },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const owns =
      (req.user.role === "ENGINEER" && job.shopId === req.user.id) ||
      (req.user.role === "CUSTOMER" && job.customerId === req.user.id);

    if (!owns) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.job = job;
    return next();
  } catch (error) {
    console.error("authorizeJob error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const authorizeChangePin = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    if (req.user.role === "CUSTOMER") {
      if (customerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return next();
    }

    if (req.user.role === "ENGINEER") {
      const shop = await prisma.shop.findUnique({
        where: { id: req.user.id },
        select: { phone: true },
      });
      if (!shop) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const linked = await prisma.customer.findUnique({
        where: { phone: shop.phone },
        select: { id: true },
      });
      if (!linked || linked.id !== customerId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    console.error("authorizeChangePin error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const serviceUnavailable = (message) => (req, res) => {
  return res.status(503).json({ message });
};
