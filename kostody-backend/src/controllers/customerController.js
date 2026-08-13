import { prisma } from "../config/db.js";

const createCustomer = async (req, res) => {
  try {
    const { phone, name } = req.body;

    let customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          phone,
          name,
          pinHash: "temp-pin-1234",
        },
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server Error" });
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

export { createCustomer, checkCustomer, getShopCustomers };
