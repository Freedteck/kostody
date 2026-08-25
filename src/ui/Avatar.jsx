import styles from "./Avatar.module.css";

const TONES = ["primary", "secondary", "tertiary"];

const initialsOf = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((w) => w[0] || "").join("");
  return letters ? letters.toUpperCase() : "?";
};

const toneFor = (name = "") => {
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return TONES[sum % TONES.length];
};

const Avatar = ({ name = "", size = 44, tone, className = "", style }) => {
  const t = tone || toneFor(name);
  return (
    <span
      className={`${styles.avatar} ${styles[t]} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38, ...style }}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
};

export default Avatar;
