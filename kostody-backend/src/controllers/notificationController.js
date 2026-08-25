import { prisma } from "../config/db.js";

const formatTime = (createdAt) =>
  new Date(createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const listNotifications = async (recipientType, recipientId, jobWhere, withShop) => {
  const events = await prisma.jobEvent.findMany({
    where: {
      job: jobWhere,
      NOT: {
        states: {
          some: { recipientType, recipientId, dismissedAt: { not: null } },
        },
      },
    },
    include: {
      job: withShop
        ? { include: { shop: { select: { shopName: true } } } }
        : true,
      states: { where: { recipientType, recipientId } },
    },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return events.map((e) => {
    const formatted = {
      id: e.id,
      time: formatTime(e.createdAt),
      event: e.eventText,
      jobId: e.jobId,
      device: e.job.deviceModel,
      read: e.states.some((s) => s.readAt),
    };
    if (withShop) formatted.shop = e.job.shop.shopName;
    return formatted;
  });
};

const markRead = async (recipientType, recipientId, jobWhere) => {
  const now = new Date();
  await prisma.notificationState.updateMany({
    where: {
      recipientType,
      recipientId,
      readAt: null,
      dismissedAt: null,
      event: { job: jobWhere },
    },
    data: { readAt: now },
  });
  const missing = await prisma.jobEvent.findMany({
    where: { job: jobWhere, states: { none: { recipientType, recipientId } } },
    select: { id: true },
  });
  if (missing.length) {
    await prisma.notificationState.createMany({
      data: missing.map((e) => ({
        eventId: e.id,
        recipientType,
        recipientId,
        readAt: now,
      })),
      skipDuplicates: true,
    });
  }
};

const dismissOne = async (recipientType, recipientId, jobWhere, eventId) => {
  const event = await prisma.jobEvent.findFirst({
    where: { id: eventId, job: jobWhere },
    select: { id: true },
  });
  if (!event) return false;
  const now = new Date();
  await prisma.notificationState.upsert({
    where: {
      eventId_recipientType_recipientId: {
        eventId,
        recipientType,
        recipientId,
      },
    },
    create: { eventId, recipientType, recipientId, dismissedAt: now },
    update: { dismissedAt: now },
  });
  return true;
};

const dismissAll = async (recipientType, recipientId, jobWhere) => {
  const now = new Date();
  await prisma.notificationState.updateMany({
    where: {
      recipientType,
      recipientId,
      dismissedAt: null,
      event: { job: jobWhere },
    },
    data: { dismissedAt: now },
  });
  const missing = await prisma.jobEvent.findMany({
    where: { job: jobWhere, states: { none: { recipientType, recipientId } } },
    select: { id: true },
  });
  if (missing.length) {
    await prisma.notificationState.createMany({
      data: missing.map((e) => ({
        eventId: e.id,
        recipientType,
        recipientId,
        dismissedAt: now,
      })),
      skipDuplicates: true,
    });
  }
};

const getShopNotifications = async (req, res) => {
  try {
    const { shopId } = req.params;
    const data = await listNotifications("SHOP", shopId, { shopId }, false);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const markShopNotificationsRead = async (req, res) => {
  try {
    const { shopId } = req.params;
    await markRead("SHOP", shopId, { shopId });
    return res.status(204).send();
  } catch (error) {
    console.error("Error marking notifications read:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const dismissShopNotification = async (req, res) => {
  try {
    const { shopId, eventId } = req.params;
    const ok = await dismissOne("SHOP", shopId, { shopId }, eventId);
    if (!ok) return res.status(404).json({ message: "Notification not found" });
    return res.status(204).send();
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const clearShopNotifications = async (req, res) => {
  try {
    const { shopId } = req.params;
    await dismissAll("SHOP", shopId, { shopId });
    return res.status(204).send();
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;
    const data = await listNotifications(
      "CUSTOMER",
      customerId,
      { customerId },
      true,
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching customer notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const markCustomerNotificationsRead = async (req, res) => {
  try {
    const { customerId } = req.params;
    await markRead("CUSTOMER", customerId, { customerId });
    return res.status(204).send();
  } catch (error) {
    console.error("Error marking customer notifications read:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const dismissCustomerNotification = async (req, res) => {
  try {
    const { customerId, eventId } = req.params;
    const ok = await dismissOne(
      "CUSTOMER",
      customerId,
      { customerId },
      eventId,
    );
    if (!ok) return res.status(404).json({ message: "Notification not found" });
    return res.status(204).send();
  } catch (error) {
    console.error("Error dismissing customer notification:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const clearCustomerNotifications = async (req, res) => {
  try {
    const { customerId } = req.params;
    await dismissAll("CUSTOMER", customerId, { customerId });
    return res.status(204).send();
  } catch (error) {
    console.error("Error clearing customer notifications:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export {
  getShopNotifications,
  markShopNotificationsRead,
  dismissShopNotification,
  clearShopNotifications,
  getCustomerNotifications,
  markCustomerNotificationsRead,
  dismissCustomerNotification,
  clearCustomerNotifications,
};
