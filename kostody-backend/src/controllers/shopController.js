import { prisma } from "../config/db.js";

const createShop = async (req, res) => {
  try {
    const { shopName, engineerName, phone, email, specialty, address } =
      req.body;
    const newShop = await prisma.shop.create({
      data: {
        shopName,
        engineerName,
        phone,
        email,
        specialty,
        address,
        passwordHash: "temp",
      },
    });
    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { createShop };
