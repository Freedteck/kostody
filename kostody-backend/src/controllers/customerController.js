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

export { createCustomer, checkCustomer };
