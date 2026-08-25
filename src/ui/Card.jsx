import { forwardRef } from "react";
import { Ripple } from "./md";
import styles from "./Card.module.css";

const Card = forwardRef(
  (
    {
      as: Comp = "div",
      variant = "elevated",
      interactive = false,
      padded = true,
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const cls = [
      styles.card,
      styles[variant],
      interactive ? styles.interactive : "",
      padded ? styles.padded : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <Comp ref={ref} className={cls} {...rest}>
        {interactive && <Ripple />}
        {children}
      </Comp>
    );
  },
);

Card.displayName = "Card";

export default Card;
