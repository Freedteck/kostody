import { prisma } from "../config/db.js";

const getShopAnalytics = async (req, res) => {
  try {
    const { shopId } = req.params;
    const jobs = await prisma.job.findMany({
      where: { shopId },
      include: { payments: true },
    });

    let totalRevenue = 0;
    let outstandingDebts = 0;
    let cashInHand = 0;

    jobs.forEach((job) => {
      const jobPaid = job.payments.reduce((sum, p) => sum + p.amount, 0);
      totalRevenue += jobPaid;

      if (job.status !== "Completed" && job.status !== "Cancelled") {
        outstandingDebts += job.quotedPrice - jobPaid;
      }

      const cashPayments = job.payments.filter((p) => p.method === "Cash");
      cashInHand += cashPayments.reduce((sum, p) => sum + p.amount, 0);
    });

    return res.status(200).json({ totalRevenue, outstandingDebts, cashInHand });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getShopStats = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { period = "month" } = req.query;

    let startDate = new Date();
    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      startDate = new Date(0); // All time fallback
    }

    const jobs = await prisma.job.findMany({
      where: {
        shopId,
        updatedAt: { gte: startDate },
      },
      select: { status: true },
    });

    let active = 0;
    let completed = 0;
    let cancelled = 0;

    jobs.forEach((job) => {
      if (job.status === "Completed") completed++;
      else if (job.status === "Cancelled") cancelled++;
      else active++;
    });

    return res.status(200).json({ active, completed, cancelled });
  } catch (error) {
    console.error("Error fetching shop stats:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { getShopAnalytics, getShopStats };
