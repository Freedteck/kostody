import { prisma } from "../config/db.js";

const getShopNotifications = async (req, res) => {
  try {
    const { shopId } = req.params;
    const events = await prisma.jobEvent.findMany({
      where: { job: { shopId } },
      include: { job: true },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    const formatted = events.map((e) => ({
      id: e.id,
      time: new Date(e.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      event: e.eventText,
      jobId: e.jobId,
      device: e.job.deviceModel,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;
    const events = await prisma.jobEvent.findMany({
      where: { job: { customerId } },
      include: {
        job: { include: { shop: { select: { shopName: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    const formatted = events.map((e) => ({
      id: e.id,
      time: new Date(e.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      event: e.eventText,
      jobId: e.jobId,
      device: e.job.deviceModel,
      shop: e.job.shop.shopName,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching customer notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { getShopNotifications, getCustomerNotifications };
