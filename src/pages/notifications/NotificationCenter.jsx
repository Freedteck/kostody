import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TopAppBar,
  IconButton,
  Card,
  Icon,
  Button,
  Skeleton,
  EmptyState,
  ErrorState,
  Divider,
} from "../../ui";
import useShop from "../../hooks/useShop";
import useNotifications from "../../hooks/useNotifications";
import styles from "./NotificationCenter.module.css";

const classify = (event = "") => {
  const e = event.toLowerCase();
  if (/transfer/.test(e)) return { icon: "swap_horiz", tone: "tertiary" };
  if (/cancel|decline/.test(e)) return { icon: "cancel", tone: "error" };
  if (/expire|quote/.test(e)) return { icon: "request_quote", tone: "secondary" };
  if (/paid|payment/.test(e)) return { icon: "payments", tone: "tertiary" };
  if (/ready|pickup/.test(e)) return { icon: "inventory_2", tone: "primary" };
  if (/complete|collect/.test(e)) return { icon: "task_alt", tone: "primary" };
  if (/confirm|lock|agree/.test(e)) return { icon: "verified_user", tone: "primary" };
  if (/return|warranty/.test(e)) return { icon: "assignment_return", tone: "tertiary" };
  if (/start|progress|repair/.test(e)) return { icon: "build", tone: "secondary" };
  return { icon: "notifications", tone: "neutral" };
};

const dayOf = (time = "") =>
  time.includes(",") ? time.split(",")[0].trim() : time || "Earlier";

const clockOf = (time = "") =>
  time.includes(",") ? time.split(",").slice(1).join(",").trim() : "";

const NotificationCenter = ({ role = "engineer" }) => {
  const navigate = useNavigate();
  const shop = useShop();
  const shopId = shop?.shopId;
  const [customerId] = useState(
    () => JSON.parse(localStorage.getItem("kostody_customer"))?.id || null,
  );
  const userId = role === "customer" ? customerId : shopId;

  useEffect(() => {
    if (role === "customer" && !customerId) navigate("/c/login");
  }, [role, customerId, navigate]);

  const { items, isLoading, error, remove, clearAll, markAllRead, reload } =
    useNotifications(role, userId);

  useEffect(() => () => markAllRead(), [markAllRead]);

  const backTo = role === "customer" ? "/c/dashboard" : "/app/dashboard";

  const openJob = (notif) => {
    remove(notif.id);
    if (notif.jobId) {
      navigate(role === "customer" ? `/c/${notif.jobId}` : `/app/job/${notif.jobId}`);
    }
  };

  const groups = items.reduce((acc, n) => {
    const key = dayOf(n.time);
    (acc[key] = acc[key] || []).push(n);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  return (
    <div className={styles.page}>
      <TopAppBar
        variant="center"
        title="Notifications"
        leading={
          <IconButton
            variant="standard"
            icon="arrow_back"
            label="Back"
            onClick={() => navigate(backTo)}
          />
        }
        actions={
          items.length > 0 ? (
            <Button variant="text" onClick={clearAll}>
              Clear all
            </Button>
          ) : null
        }
      />

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.skeletons}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} width="100%" height="72px" radius="20px" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState
            icon="notifications"
            title="You're all caught up"
            message="Updates about your repairs will show up here as they happen."
          />
        ) : (
          groupKeys.map((day) => (
            <section key={day} className={styles.group}>
              <h2 className={`${styles.dayLabel} md-typescale-label-large`}>
                {day}
              </h2>
              <Card variant="outlined" padded={false} className={styles.list}>
                {groups[day].map((n, idx) => {
                  const meta = classify(n.event);
                  return (
                    <Fragment key={n.id}>
                      {idx > 0 && <Divider />}
                      <div
                        className={`${styles.row} ${n.unread ? styles.unread : ""}`}
                      >
                        <button
                          type="button"
                          className={styles.rowMain}
                          onClick={() => openJob(n)}
                        >
                          <span
                            className={`${styles.badge} ${styles[meta.tone]}`}
                          >
                            <Icon name={meta.icon} size={22} filled />
                          </span>
                          <span className={styles.rowText}>
                            <span
                              className={`${styles.event} md-typescale-body-large`}
                            >
                              {n.event}
                            </span>
                            <span
                              className={`${styles.meta} md-typescale-label-medium`}
                            >
                              {role === "customer" && n.shop
                                ? `${n.shop} · `
                                : ""}
                              {n.device}
                              {clockOf(n.time) ? ` · ${clockOf(n.time)}` : ""}
                            </span>
                          </span>
                          {n.unread && <span className={styles.unreadDot} />}
                        </button>
                        <IconButton
                          variant="standard"
                          icon="close"
                          label="Dismiss"
                          size={20}
                          className={styles.dismiss}
                          onClick={() => remove(n.id)}
                        />
                      </div>
                    </Fragment>
                  );
                })}
              </Card>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
