import styles from "./EmptyState.module.css";

const EmptyState = ({ title, message, icon }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        {icon ? (
          icon
        ) : (
          // Custom Minimalist SVG: Dashed Clipboard
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3H15C15.5523 3 16 3.44772 16 4V6H8V4C8 3.44772 8.44772 3 9 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect
              x="4"
              y="6"
              width="16"
              height="15"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <path
              d="M9 12H15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9 16H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default EmptyState;
