import { prisma } from "../config/db.js";

const getShopProfile = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        shopName: true,
        engineerName: true,
        phone: true,
        email: true,
        address: true,
        specialty: true,
      },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const customer = await prisma.customer.findUnique({
      where: { phone: shop.phone },
      select: { id: true },
    });

    return res.status(200).json({ ...shop, customerId: customer?.id || null });
  } catch (error) {
    console.error("Error fetching shop profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updateShopProfile = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { shopName, engineerName, phone, email, shopAddress, specialty } =
      req.body;

    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: {
        shopName,
        engineerName,
        phone,
        email,
        address: shopAddress,
        specialty,
      },
      select: {
        id: true,
        shopName: true,
        engineerName: true,
        phone: true,
        email: true,
        address: true,
        specialty: true,
      },
    });

    return res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Error updating shop profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { getShopProfile, updateShopProfile };
