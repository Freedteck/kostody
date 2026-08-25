import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";
import styles from "./PhotoViewer.module.css";

const PhotoViewer = ({ open, photos = [], startIndex = 0, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [prev, setPrev] = useState({ open, startIndex });
  const count = photos.length;

  if (prev.open !== open || prev.startIndex !== startIndex) {
    setPrev({ open, startIndex });
    if (open) setIndex(startIndex);
  }

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  if (!open || !count) return null;

  return createPortal(
    <div className={styles.scrim} onClick={onClose}>
      <div className={styles.top}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" />
        </button>
        {count > 1 && (
          <span className={`${styles.counter} md-typescale-label-large`}>
            {index + 1} / {count}
          </span>
        )}
      </div>

      <img
        className={styles.image}
        src={photos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
      />

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
          >
            <Icon name="chevron_left" size={28} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
          >
            <Icon name="chevron_right" size={28} />
          </button>
        </>
      )}
    </div>,
    document.body,
  );
};

export default PhotoViewer;
