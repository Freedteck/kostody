import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const SAFE_CUSTOMER = { id: true, name: true, phone: true };
const SAFE_SHOP = {
  id: true,
  shopName: true,
  phone: true,
  engineerName: true,
  specialty: true,
  address: true,
};

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
      referralId,
      parentJobId,
      isReturnJob,
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
          customerConfirmed: true,
          parentJobId: referralId || parentJobId || null,
          isReturn: isReturnJob || false,
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

      if (isReturnJob && parentJobId) {
        await tx.jobEvent.create({
          data: {
            jobId: parentJobId,
            eventText: `Device returned. New Return Job #${job.id} created due to imperfection.`,
          },
        });
      }

      if (referralId) {
        await tx.job.update({
          where: { id: referralId },
          data: {
            status: "Transferred",
            transferStatus: "pending_acceptance",
          },
        });

        await tx.jobEvent.create({
          data: {
            jobId: referralId,
            eventText:
              "Device transferred to another engineer. Awaiting acceptance.",
          },
        });
      }

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

const createPendingJob = async (req, res) => {
  try {
    const {
      shopId,
      customerName,
      customerPhone,
      deviceModel,
      faultDescription,
      accessoriesRetained,
      quotedPrice,
      upfrontPayment,
      quoteValidityDays,
      parentJobId,
      isReturnJob,
    } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(quoteValidityDays));

    const newJob = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({
        where: { phone: customerPhone },
      });
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            phone: customerPhone,
            name: customerName,
            pinHash: "PENDING_SETUP",
          },
        });
      }

      const customId = `KSD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const job = await tx.job.create({
        data: {
          id: customId,
          shopId,
          customerId: customer.id,
          deviceModel,
          faultDescription,
          accessoriesRetained,
          quotedPrice: Number(quotedPrice),
          upfrontPayment: Number(upfrontPayment),
          quoteValidityDays: Number(quoteValidityDays),
          expiresAt,
          parentJobId: parentJobId || null,
          isReturn: isReturnJob || false,
          status: "Pending Confirmation",
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
          eventText: "Job created. Link sent to customer for confirmation.",
        },
      });

      if (isReturnJob && parentJobId) {
        await tx.jobEvent.create({
          data: {
            jobId: parentJobId,
            eventText: `Device returned. New Return Job #${job.id} created due to imperfection.`,
          },
        });
      }

      return job;
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating pending job:", error);
    res
      .status(500)
      .json({ message: "Server Error: Could not create pending job" });
  }
};

const checkReferralJob = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const looksLikeId = q.toUpperCase().startsWith("KSD-");

    if (looksLikeId) {
      const job = await prisma.job.findUnique({
        where: { id: q.toUpperCase() },
        include: { shop: { select: { shopName: true, phone: true } } },
      });

      if (!job) {
        return res.status(404).json({ message: "Job ID not found" });
      }

      return res.status(200).json({
        results: [
          {
            id: job.id,
            deviceModel: job.deviceModel,
            customerName: job.shop?.shopName,
            customerPhone: job.shop?.phone,
          },
        ],
      });
    }

    const jobs = await prisma.job.findMany({
      where: {
        customer: { phone: { contains: q, mode: "insensitive" } },
        status: "Completed",
      },
      include: { customer: { select: SAFE_CUSTOMER } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      results: jobs.map((job) => ({
        id: job.id,
        deviceModel: job.deviceModel,
        customerName: job.customer?.name,
        customerPhone: job.customer?.phone,
        customerId: job.customer?.id,
      })),
    });
  } catch (error) {
    console.error("Error checking referral job:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const cancelJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { enteredPin } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { customer: true },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    if (job.status === "Completed") {
      throw new Error("ALREADY_COMPLETED");
    }

    if (job.status === "Cancelled") {
      throw new Error("ALREADY_CANCELLED");
    }

    if (job.customerConfirmed) {
      if (!enteredPin) {
        throw new Error("PIN_REQUIRED");
      }
      const isMatch = await bcrypt.compare(enteredPin, job.customer.pinHash);
      if (!isMatch) {
        throw new Error("INVALID_PIN");
      }
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id: jobId },
        data: { status: "Cancelled" },
      });

      await tx.jobEvent.create({
        data: {
          jobId: jobId,
          eventText: job.customerConfirmed
            ? "Job Cancelled. Customer PIN verified."
            : "Job Cancelled by Engineer (Pre-confirmation).",
        },
      });

      return updated;
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    if (error.message === "JOB_NOT_FOUND")
      return res.status(404).json({ message: "Job not found" });
    if (error.message === "ALREADY_COMPLETED")
      return res
        .status(400)
        .json({ message: "Completed jobs cannot be cancelled" });
    if (error.message === "ALREADY_CANCELLED")
      return res.status(400).json({ message: "Job is already cancelled" });
    if (error.message === "PIN_REQUIRED")
      return res
        .status(400)
        .json({ message: "Customer PIN is required to cancel this job" });
    if (error.message === "INVALID_PIN")
      return res.status(401).json({ message: "Invalid PIN" });

    console.error("Error cancelling job:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not cancel job" });
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
        : { notIn: ["Completed", "Cancelled"] };

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
        { customer: { phone: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereCondition,
      include: {
        customer: { select: SAFE_CUSTOMER },
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
          customer: { select: SAFE_CUSTOMER },
          events: {
            orderBy: { createdAt: "asc" },
          },
          shop: { select: SAFE_SHOP },
          payments: true,
          photos: true,
        },
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const childJob = await prisma.job.findFirst({
        where: { parentJobId: jobId },
        select: { id: true, shopId: true, status: true },
      });

      res.status(200).json({ ...job, childJob });
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

const acceptTransfer = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { enteredPin } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { shop: true },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.transferStatus !== "pending_acceptance") {
      return res.status(400).json({ message: "Transfer is not pending" });
    }

    const shop = job.shop;

    let engineerCustomer = await prisma.customer.findUnique({
      where: { phone: shop.phone },
    });

    if (!engineerCustomer) {
      if (!enteredPin) {
        return res
          .status(400)
          .json({ message: "Please set up your Shop PIN first" });
      }
      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(enteredPin, salt);

      engineerCustomer = await prisma.customer.create({
        data: {
          phone: shop.phone,
          name: shop.shopName,
          pinHash,
        },
      });
    } else {
      if (!engineerCustomer.pinHash) {
        return res
          .status(400)
          .json({ message: "Please set up your PIN first" });
      }
      const isMatch = await bcrypt.compare(
        enteredPin,
        engineerCustomer.pinHash,
      );
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid PIN" });
      }
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id: jobId },
        data: { transferStatus: "None" },
      });

      await tx.jobEvent.create({
        data: {
          jobId,
          eventText:
            "Transfer Accepted. Device is currently with the specialist.",
        },
      });

      return updated;
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error accepting transfer:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not accept transfer" });
  }
};

const processCollection = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { enteredPin, finalPaymentAmount, method } = req.body;

    if (!jobId || !enteredPin) {
      return res.status(400).json({ message: "Job ID and PIN are required" });
    }

    const parsedPayment = Number(finalPaymentAmount) || 0;
    if (parsedPayment < 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const job = await tx.job.findUnique({
        where: { id: jobId },
        include: { customer: true },
      });

      if (!job) {
        throw new Error("JOB_NOT_FOUND");
      }

      if (job.status === "Completed") {
        throw new Error("ALREADY_COMPLETED");
      }

      const customer = job.customer;
      if (!customer || !customer.pinHash) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }

      const isMatch = await bcrypt.compare(enteredPin, customer.pinHash);
      if (!isMatch) {
        throw new Error("INVALID_PIN");
      }

      if (parsedPayment > 0) {
        await tx.payment.create({
          data: {
            jobId: jobId,
            amount: parsedPayment,
            method: method || "Cash",
          },
        });
      }

      await tx.jobEvent.create({
        data: {
          jobId: jobId,
          eventText: "Job Closed. Device collected. Customer PIN verified.",
        },
      });

      const jobUpdated = await tx.job.update({
        where: { id: jobId },
        data: { status: "Completed" },
        include: {
          customer: { select: SAFE_CUSTOMER },
          payments: true,
          events: { orderBy: { createdAt: "asc" } },
        },
      });

      if (job.parentJobId) {
        await tx.job.update({
          where: { id: job.parentJobId },
          data: {
            status: "In Progress",
            transferStatus: "None",
          },
        });

        await tx.jobEvent.create({
          data: {
            jobId: job.parentJobId,
            eventText: "Device collected from specialist. Back in possession.",
          },
        });
      }

      return jobUpdated;
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    if (error.message === "JOB_NOT_FOUND") {
      return res.status(404).json({ message: "Job not found" });
    }
    if (error.message === "ALREADY_COMPLETED") {
      return res.status(400).json({ message: "Job is already completed" });
    }
    if (error.message === "CUSTOMER_NOT_FOUND") {
      return res.status(404).json({ message: "Customer record not found" });
    }
    if (error.message === "INVALID_PIN") {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    console.error("Error processing collection:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not process collection" });
  }
};

const requoteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { enteredPin, newPrice, validityDays } = req.body;

    if (!jobId || !enteredPin || !newPrice || !validityDays) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const job = await tx.job.findUnique({
        where: { id: jobId },
        include: { customer: true },
      });

      if (!job) throw new Error("JOB_NOT_FOUND");

      const isMatch = await bcrypt.compare(enteredPin, job.customer.pinHash);
      if (!isMatch) throw new Error("INVALID_PIN");

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(validityDays));

      const updated = await tx.job.update({
        where: { id: jobId },
        data: {
          quotedPrice: Number(newPrice),
          quoteValidityDays: Number(validityDays),
          expiresAt,
          status: "In Progress",
        },
      });

      await tx.jobEvent.create({
        data: {
          jobId: jobId,
          eventText: `New quote raised (₦${Number(newPrice).toLocaleString()}) and authorized by customer.`,
        },
      });

      return updated;
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    if (error.message === "JOB_NOT_FOUND")
      return res.status(404).json({ message: "Job not found" });
    if (error.message === "INVALID_PIN")
      return res.status(401).json({ message: "Invalid PIN" });

    console.error("Error raising quote:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not raise new quote" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      deviceModel,
      faultDescription,
      accessoriesRetained,
      quotedPrice,
      upfrontPayment,
      quoteValidityDays,
    } = req.body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.customerConfirmed)
      return res.status(403).json({ message: "Cannot edit a confirmed job" });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(quoteValidityDays));

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        deviceModel,
        faultDescription,
        accessoriesRetained,
        quotedPrice: Number(quotedPrice),
        upfrontPayment: Number(upfrontPayment),
        quoteValidityDays: Number(quoteValidityDays),
        expiresAt,
      },
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not update job" });
  }
};

const getJobHistory = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { search, status } = req.query;

    const whereCondition = {
      shopId: shopId,
      status: status || "Completed",
    };

    if (search && search.trim() !== "") {
      const searchTerm = search.trim();
      whereCondition.OR = [
        { deviceModel: { contains: searchTerm, mode: "insensitive" } },
        { id: { contains: searchTerm, mode: "insensitive" } },
        { customer: { name: { contains: searchTerm, mode: "insensitive" } } },
        { customer: { phone: { contains: searchTerm, mode: "insensitive" } } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereCondition,
      include: { customer: { select: SAFE_CUSTOMER } },
      orderBy: { updatedAt: "desc" },
    });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching history:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not fetch history" });
  }
};

const confirmJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { enteredPin } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { customer: true },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    if (job.customerConfirmed) {
      throw new Error("ALREADY_CONFIRMED");
    }

    const customer = job.customer;
    if (!customer || !customer.pinHash) {
      throw new Error("CUSTOMER_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(enteredPin, customer.pinHash);
    if (!isMatch) {
      throw new Error("INVALID_PIN");
    }

    const updatedJob = await prisma.$transaction(async (tx) => {
      const updated = await tx.job.update({
        where: { id: jobId },
        data: { status: "In Progress", customerConfirmed: true },
      });

      await tx.jobEvent.create({
        data: {
          jobId: jobId,
          eventText: "Job Confirmed by Customer.",
        },
      });

      return updated;
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    if (error.message === "JOB_NOT_FOUND")
      return res.status(404).json({ message: "Job not found" });
    if (error.message === "ALREADY_CONFIRMED")
      return res.status(400).json({ message: "Job is already confirmed" });
    if (error.message === "CUSTOMER_NOT_FOUND")
      return res.status(404).json({ message: "Customer record not found" });
    if (error.message === "INVALID_PIN")
      return res.status(401).json({ message: "Invalid PIN" });

    console.error("Error confirming job:", error);
    return res
      .status(500)
      .json({ message: "Server Error: Could not confirm job" });
  }
};

export {
  lockJob,
  createPendingJob,
  checkReferralJob,
  cancelJob,
  getJobsByShop,
  getJobById,
  updateJobStatus,
  addPayment,
  processCollection,
  acceptTransfer,
  requoteJob,
  updateJob,
  getJobHistory,
  confirmJob,
};
