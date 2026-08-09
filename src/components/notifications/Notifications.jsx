import styles from "./Notifications.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

// Mock notifications - later this will come from the database
const mockNotifications = [
  {
    id: 1,
    time: "2 mins ago",
    event: "Customer authorized agreement for iPhone 13 Pro.",
  },
  { id: 2, time: "1 hour ago", event: "Transfer accepted from Engr. Alaba." },
  { id: 3, time: "Yesterday", event: "Quote expired for Samsung A14." },
];

const Notifications = ({ onClose }) => {
  return (
    <BottomSheet onClose={onClose} title="Notifications">
      <div className={styles.listContainer}>
        {mockNotifications.length === 0 ? (
          <p className={styles.empty}>No new notifications.</p>
        ) : (
          mockNotifications.map((notif) => (
            <div key={notif.id} className={styles.notifItem}>
              <p className={styles.time}>{notif.time}</p>
              <p className={styles.event}>{notif.event}</p>
            </div>
          ))
        )}
      </div>
    </BottomSheet>
  );
};

export default Notifications;
