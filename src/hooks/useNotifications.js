import { useCallback, useEffect, useState } from "react";
import { getShopNotifications, getCustomerNotifications } from "../services/api";

const readKey = (role) => `kostody_notif_read_${role}`;
const deletedKey = (role) => `kostody_notif_deleted_${role}`;

const loadIds = (key) => {
  const raw = localStorage.getItem(key);
  const parsed = raw ? JSON.parse(raw) : [];
  return Array.isArray(parsed) ? parsed : [];
};

const useNotifications = (role, userId) => {
  const [raw, setRaw] = useState([]);
  const [readIds, setReadIds] = useState(() => loadIds(readKey(role)));
  const [deletedIds, setDeletedIds] = useState(() => loadIds(deletedKey(role)));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    const fetcher =
      role === "customer" ? getCustomerNotifications : getShopNotifications;
    fetcher(userId)
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

  const items = raw
    .filter((n) => !deletedIds.includes(n.id))
    .map((n) => ({ ...n, unread: !readIds.includes(n.id) }));

  const unreadCount = items.filter((n) => n.unread).length;

  const remove = useCallback(
    (id) => {
      setDeletedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        localStorage.setItem(deletedKey(role), JSON.stringify(next));
        return next;
      });
    },
    [role],
  );

  const clearAll = useCallback(() => {
    setDeletedIds((prev) => {
      const next = Array.from(new Set([...prev, ...raw.map((n) => n.id)]));
      localStorage.setItem(deletedKey(role), JSON.stringify(next));
      return next;
    });
  }, [role, raw]);

  const markAllRead = useCallback(() => {
    const ids = raw.map((n) => n.id);
    if (!ids.length) return;
    const next = Array.from(new Set([...loadIds(readKey(role)), ...ids]));
    localStorage.setItem(readKey(role), JSON.stringify(next));
    setReadIds(next);
  }, [role, raw]);

  const reload = useCallback(() => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

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
