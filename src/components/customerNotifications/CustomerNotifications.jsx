import { useEffect, useState } from "react";
import styles from "../notifications/Notifications.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { getCustomerNotifications } from "../../services/api";
import { Skeleton } from "../skeleton/Skeleton";

const CustomerNotifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("kostody_customer"));
    if (!customerData) return;

    const fetchNotifs = async () => {
      setIsLoading(true);
      await getCustomerNotifications(customerData.id)
        .then((data) => {
          setNotifications(data);
        })
        .catch(() => {
          console.error("Failed to fetch notifications");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchNotifs();
  }, []);

  return (
    <BottomSheet onClose={onClose} title="Notifications">
      <div className={styles.listContainer}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height="60px" radius="8px" />
          ))
        ) : notifications.length === 0 ? (
          <p className={styles.empty}>No new notifications.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={styles.notifItem}>
              <p className={styles.time}>
                {notif.shop} · {notif.time}
              </p>
              <p className={styles.event}>{notif.event}</p>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
};

export default CustomerNotifications;
