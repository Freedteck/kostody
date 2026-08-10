import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const lockJob = async (req, res) => {
  try {
    const {
      shopId,
      customerName,
      customerPhone,
      customerId,
      deviceModel,
      faultDescription,
      accessoriesRetained,
      quotedPrice,
      upfrontPayment,
      quoteValidityDays,
      enteredPin,
    } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + quoteValidityDays);

    let finalCustomerId;

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      const isMatch = await bcrypt.compare(enteredPin, customer.pinHash);
      if (!isMatch) return res.status(401).json({ message: "Invalid PIN" });

      finalCustomerId = customer.id;
    } else {
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(enteredPin, salt);

      const newCustomer = await prisma.customer.create({
        data: { phone: customerPhone, name: customerName, pinHash },
      });

      finalCustomerId = newCustomer.id;
    }
    const customId = `KSD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newJob = await prisma.job.create({
      data: {
        id: customId,
        shopId,
        customerId: finalCustomerId,
        deviceModel,
        faultDescription,
        accessoriesRetained,
        quotedPrice: Number(quotedPrice),
        upfrontPayment: Number(upfrontPayment),
        quoteValidityDays: Number(quoteValidityDays),
        expiresAt,
        status: "In Progress",
      },
    });

    await prisma.jobEvent.create({
      data: {
        jobId: newJob.id,
        eventText: "Job Created & Authorized by Customer",
      },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error locking job:", error);
    res.status(500).json({ message: "Server Error: Could not lock job" });
  }
};

const getJobsByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { filter, search } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "Shop Id is Required" });
    }

    const statusFilter =
      filter && filter !== "undefined" && filter !== ""
        ? filter
        : { not: "Completed" };

    const whereCondition = {
      shopId: shopId,
      status: statusFilter,
    };

    if (search && search !== "undefined" && search.trim() !== "") {
      const searchTerm = search.trim();
      whereCondition.OR = [
        { deviceModel: { contains: searchTerm, mode: "insensitive" } },
        { id: { contains: searchTerm, mode: "insensitive" } },
        { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereCondition,
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching Jobs", error);
    res.status(500).json({ message: "Server Error: Could not fetch Jobs" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          customer: true,
          events: {
            orderBy: { createdAt: "asc" },
          },
          payments: true,
        },
      });

      res.status(200).json(job);
    } else {
      return res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error getting Job", error);
    res.status(500).json({ message: "Server Error: Could not get Job" });
  }
};

export { lockJob, getJobsByShop, getJobById };
