import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Sheet.module.css";

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1']), md-filled-button, md-filled-tonal-button, md-outlined-button, md-text-button, md-icon-button, md-filled-icon-button, md-outlined-text-field, md-filled-text-field, md-outlined-select, md-filled-select, md-switch, md-checkbox";

let lockCount = 0;

const Sheet = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  dismissible = true,
  size = "default",
  className = "",
}) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setMounted(true);
  }

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement;
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    const id = requestAnimationFrame(() => setVisible(false));
    const t = setTimeout(() => setMounted(false), 300);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!mounted) return undefined;
    lockCount += 1;
    document.body.style.overflow = "hidden";
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.style.overflow = "";
    };
  }, [mounted]);

  useEffect(() => {
    if (visible && panelRef.current) {
      const first = panelRef.current.querySelector(FOCUSABLE);
      (first || panelRef.current).focus?.();
    }
  }, [visible]);

  useEffect(() => {
    if (mounted || !restoreRef.current) return;
    restoreRef.current.focus?.();
    restoreRef.current = null;
  }, [mounted]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && dismissible) {
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const list = Array.from(nodes);
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus?.();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus?.();
      }
    },
    [dismissible, onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <div
      className={`${styles.root} ${visible ? styles.visible : ""}`}
      onKeyDown={onKeyDown}
    >
      <div
        className={styles.scrim}
        onClick={() => dismissible && onClose?.()}
      />
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size] || ""} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <div className={styles.grabber} aria-hidden="true">
          <span className={styles.handle} />
        </div>
        {title && (
          <header className={styles.header}>
            <h2 className={`${styles.title} md-typescale-headline-small`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${styles.subtitle} md-typescale-body-medium`}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div className={styles.body}>{children}</div>
        {actions && <footer className={styles.actions}>{actions}</footer>}
      </div>
    </div>,
    document.body,
  );
};

export default Sheet;
