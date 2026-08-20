import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sanitizeCustomer = (customer) => {
  if (!customer) return null;
  const safe = { ...customer };
  delete safe.pinHash;
  delete safe.otp;
  delete safe.otpExpiry;
  return safe;
};

const createCustomer = async (req, res) => {
  try {
    const { phone, name, pin } = req.body;

    let customer = await prisma.customer.findUnique({ where: { phone } });
    if (customer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    customer = await prisma.customer.create({
      data: { phone, name, pinHash },
    });

    const token = jwt.sign(
      { id: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(201).json({ token, data: sanitizeCustomer(customer) });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const checkCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (customer) {
      res.status(200).json({
        exists: true,
        name: customer.name,
        customerId: customer.id,
      });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking customer:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getShopCustomers = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { search } = req.query;

    const whereCondition = {
      jobs: { some: { shopId: shopId } },
    };

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      whereCondition.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { phone: { contains: searchTerm } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereCondition,
      include: {
        jobs: {
          where: { shopId: shopId, status: "Completed" },
          select: {
            id: true,
            deviceModel: true,
            faultDescription: true,
            quotedPrice: true,
            updatedAt: true,
          },
        },
      },
    });

    const mappedCustomers = customers.map((c) => {
      const totalSpent = c.jobs.reduce((sum, job) => sum + job.quotedPrice, 0);
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        jobs: c.jobs.map((j) => ({
          id: j.id,
          device: j.deviceModel,
          fault: j.faultDescription,
          price: j.quotedPrice,
          date: new Date(j.updatedAt).toLocaleDateString(),
        })),
        totalSpent,
      };
    });

    return res.status(200).json(mappedCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not fetch customers" });
  }
};

const changePin = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { oldPin, newPin } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    if (!customer.pinHash)
      return res
        .status(400)
        .json({ message: "No PIN set. Please set up a PIN first." });

    const isMatch = await bcrypt.compare(oldPin, customer.pinHash);
    if (!isMatch) return res.status(401).json({ message: "Incorrect old PIN" });

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(newPin, salt);

    await prisma.customer.update({
      where: { id: customerId },
      data: { pinHash },
    });

    return res.status(200).json({ message: "PIN updated successfully" });
  } catch (error) {
    console.error("Error changing PIN:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const customer = await prisma.customer.findUnique({ where: { phone } });
    if (!customer)
      return res
        .status(404)
        .json({ message: "No account found with this phone number" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { otp, otpExpiry },
    });

    return res
      .status(200)
      .json({ message: "OTP sent successfully", devOtp: otp });
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const resetPin = async (req, res) => {
  try {
    const { phone, otp, newPin } = req.body;
    const customer = await prisma.customer.findUnique({ where: { phone } });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    if (!customer.otp || !customer.otpExpiry)
      return res.status(400).json({ message: "Please request an OTP first" });
    if (customer.otp !== otp)
      return res.status(401).json({ message: "Invalid OTP" });
    if (new Date(customer.otpExpiry) < new Date())
      return res.status(401).json({ message: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(newPin, salt);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { pinHash, otp: null, otpExpiry: null },
    });

    return res.status(200).json({ message: "PIN reset successfully" });
  } catch (error) {
    console.error("Error resetting PIN:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    const customer = await prisma.customer.findUnique({ where: { phone } });

    if (!customer) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (!customer.pinHash) {
      return res.status(400).json({ message: "Please set up your PIN first" });
    }

    const isMatch = await bcrypt.compare(pin, customer.pinHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    const token = jwt.sign(
      { id: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(200).json({ token, data: sanitizeCustomer(customer) });
  } catch (error) {
    console.error("Error logging in customer:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCustomerJobs = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { search } = req.query;

    const whereCondition = {
      customerId: customerId,
    };

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      whereCondition.OR = [
        { deviceModel: { contains: searchTerm, mode: "insensitive" } },
        { id: { contains: searchTerm, mode: "insensitive" } },
        { shop: { shopName: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereCondition,
      include: {
        shop: {
          select: { shopName: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching customer jobs:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, phone } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: { name, phone },
      select: { id: true, name: true, phone: true },
    });

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Phone number already in use." });
    }
    console.error("Error updating customer profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export {
  createCustomer,
  checkCustomer,
  getShopCustomers,
  changePin,
  requestOtp,
  resetPin,
  loginCustomer,
  getCustomerJobs,
  updateCustomerProfile,
};
