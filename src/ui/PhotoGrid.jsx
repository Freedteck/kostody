import { useEffect, useMemo, useRef } from "react";
import Icon from "./Icon";
import styles from "./PhotoGrid.module.css";

const srcOf = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof File !== "undefined" && item instanceof File)
    return URL.createObjectURL(item);
  return item.url || item.src || "";
};

const PhotoGrid = ({
  photos = [],
  editable = false,
  onAddFiles,
  onRemove,
  onOpen,
  max = 8,
  capture = "environment",
}) => {
  const inputRef = useRef(null);
  const sources = useMemo(() => photos.map(srcOf), [photos]);

  useEffect(
    () => () => {
      photos.forEach((p, i) => {
        if (typeof File !== "undefined" && p instanceof File)
          URL.revokeObjectURL(sources[i]);
      });
    },
    [photos, sources],
  );

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onAddFiles?.(files);
    e.target.value = "";
  };

  return (
    <div className={styles.grid}>
      {sources.map((src, i) => (
        <div key={i} className={styles.tile}>
          <button
            type="button"
            className={styles.thumb}
            onClick={() => onOpen?.(i)}
            aria-label={`View photo ${i + 1}`}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
          {editable && (
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove?.(i)}
              aria-label={`Remove photo ${i + 1}`}
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>
      ))}
      {editable && photos.length < max && (
        <>
          <button
            type="button"
            className={styles.add}
            onClick={() => inputRef.current?.click()}
          >
            <Icon name="add_a_photo" size={26} />
            <span className="md-typescale-label-small">Add</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture={capture}
            multiple
            hidden
            onChange={handleFiles}
          />
        </>
      )}
    </div>
  );
};

export default PhotoGrid;
