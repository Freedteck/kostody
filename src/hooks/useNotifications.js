import { useCallback, useEffect, useRef, useState } from "react";
import {
  getShopNotifications,
  getCustomerNotifications,
  markShopNotificationsRead,
  markCustomerNotificationsRead,
  dismissShopNotification,
  dismissCustomerNotification,
  clearShopNotifications,
  clearCustomerNotifications,
} from "../services/api";

const shopFns = {
  markRead: markShopNotificationsRead,
  dismiss: dismissShopNotification,
  clear: clearShopNotifications,
};

const customerFns = {
  markRead: markCustomerNotificationsRead,
  dismiss: dismissCustomerNotification,
  clear: clearCustomerNotifications,
};

const useNotifications = (role, userId) => {
  const [raw, setRaw] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const rawRef = useRef([]);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    const list =
      role === "customer" ? getCustomerNotifications : getShopNotifications;
    list(userId)
      .then((data) => {
        if (active) {
          setRaw(data || []);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError("We couldn't load your notifications.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [role, userId, reloadKey]);

  useEffect(() => {
    rawRef.current = raw;
  }, [raw]);

  const items = raw.map((n) => ({ ...n, unread: !n.read }));
  const unreadCount = items.filter((n) => n.unread).length;

  const reload = useCallback(() => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const remove = useCallback(
    (id) => {
      setRaw((prev) => prev.filter((n) => n.id !== id));
      if (!userId) return;
      const api = role === "customer" ? customerFns : shopFns;
      api.dismiss(userId, id).catch(() => reload());
    },
    [role, userId, reload],
  );

  const clearAll = useCallback(() => {
    setRaw([]);
    if (!userId) return;
    const api = role === "customer" ? customerFns : shopFns;
    api.clear(userId).catch(() => reload());
  }, [role, userId, reload]);

  const markAllRead = useCallback(() => {
    if (!userId) return;
    if (!rawRef.current.some((n) => !n.read)) return;
    setRaw((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
    const api = role === "customer" ? customerFns : shopFns;
    api.markRead(userId).catch(() => reload());
  }, [role, userId, reload]);

  return {
    items,
    unreadCount,
    isLoading,
    error,
    remove,
    clearAll,
    markAllRead,
    reload,
  };
};

export default useNotifications;
