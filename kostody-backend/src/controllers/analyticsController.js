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

export { getShopAnalytics };
