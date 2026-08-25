const Icon = ({
  name,
  filled = false,
  size = 24,
  weight = 400,
  grade = 0,
  className = "",
  style,
  label,
  slot,
  ...rest
}) => {
  const settings = `"FILL" ${filled ? 1 : 0}, "wght" ${weight}, "GRAD" ${grade}, "opsz" ${size}`;
  return (
    <span
      slot={slot}
      className={`material-symbols-rounded ${className}`}
      style={{ fontSize: `${size}px`, fontVariationSettings: settings, ...style }}
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      aria-label={label}
      {...rest}
    >
      {name}
    </span>
  );
};

export default Icon;
