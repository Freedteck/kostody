import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerShop = async (req, res) => {
  try {
    const {
      shopName,
      engineerName,
      phone,
      email,
      password,
      specialty,
      address,
    } = req.body;

    const shop = await prisma.shop.findUnique({
      where: {
        email: email,
      },
    });

    if (shop) {
      return res.status(401).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newShop = await prisma.shop.create({
      data: {
        address,
        email,
        engineerName,
        passwordHash,
        phone,
        shopName,
        specialty,
      },
    });

    const { passwordHash: _, ...shopWithoutPassword } = newShop;
    const token = jwt.sign(
      { id: newShop.id, role: "ENGINEER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(201).json({ data: shopWithoutPassword, token });
  } catch (error) {
    console.error("Failed to create shop:", error);
    res.status(500).json({ message: "Server Error: could not create Shop" });
  }
};

const loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;
    const shop = await prisma.shop.findUnique({
      where: {
        email: email,
      },
    });

    if (!shop) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, shop.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: shop.id, role: "ENGINEER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    let customer = await prisma.customer.findUnique({
      where: { phone: shop.phone },
    });

    res.status(200).json({
      token,
      data: { ...shop, customerId: customer?.id || null },
    });
  } catch (error) {
    console.error("Failed to Login:", error);
    res.status(500).json({ message: "Server Error: Login Failed" });
  }
};

export { registerShop, loginShop };
