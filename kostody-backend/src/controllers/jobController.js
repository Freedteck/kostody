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

    const newJob = await prisma.$transaction(async (tx) => {
      let finalCustomerId;

      if (customerId) {
        const customer = await tx.customer.findUnique({
          where: { id: customerId },
        });
        if (!customer) {
          throw new Error("CUSTOMER_NOT_FOUND");
        }

        const isMatch = await bcrypt.compare(enteredPin, customer.pinHash);
        if (!isMatch) {
          throw new Error("INVALID_PIN");
        }

        finalCustomerId = customer.id;
      } else {
        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(enteredPin, salt);

        const newCustomer = await tx.customer.create({
          data: { phone: customerPhone, name: customerName, pinHash },
        });

        finalCustomerId = newCustomer.id;
      }

      const customId = `KSD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const job = await tx.job.create({
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

      if (Number(upfrontPayment) > 0) {
        await tx.payment.create({
          data: {
            jobId: job.id,
            amount: Number(upfrontPayment),
            method: "Cash",
          },
        });
      }

      await tx.jobEvent.create({
        data: {
          jobId: job.id,
          eventText: "Job Created & Authorized by Customer",
        },
      });

      return job;
    });

    res.status(201).json(newJob);
  } catch (error) {
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (error.message === "INVALID_PIN") {
      return res.status(401).json({ message: "Invalid PIN" });
    }

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

const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!jobId || !status) {
      return res
        .status(400)
        .json({ message: "Job ID and status are required." });
    }

    const eventMessage =
      status === "Ready for Pickup"
        ? "Marked as Ready for Pickup"
        : `Status updated to: ${status}`;

    const [updatedJob] = await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { status },
      }),
      prisma.jobEvent.create({
        data: {
          jobId: jobId,
          eventText: eventMessage,
        },
      }),
    ]);

    return res.status(200).json(updatedJob);
  } catch (error) {
    // Catch Prisma "Record to update not found" error code P2025
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job not found" });
    }

    console.error("Error updating job status:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not update job status" });
  }
};

const addPayment = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { amount, method } = req.body;

    const parsedAmount = Number(amount);

    if (!jobId || !parsedAmount || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Valid Job ID and positive amount are required." });
    }

    const [newPayment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          jobId,
          amount: parsedAmount,
          method: method,
        },
      }),
      prisma.jobEvent.create({
        data: {
          jobId,
          eventText: `Payment of ${parsedAmount} logged (${method})`,
        },
      }),
    ]);

    return res.status(201).json(newPayment);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({ message: "Job not found" });
    }

    console.error("Error adding payment:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not process payment" });
  }
};

export { lockJob, getJobsByShop, getJobById, updateJobStatus, addPayment };
