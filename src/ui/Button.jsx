import {
  FilledButton,
  TonalButton,
  OutlinedButton,
  TextButton,
  ElevatedButton,
} from "./md";
import Icon from "./Icon";

const VARIANTS = {
  filled: FilledButton,
  tonal: TonalButton,
  outlined: OutlinedButton,
  text: TextButton,
  elevated: ElevatedButton,
};

const Button = ({
  variant = "filled",
  children,
  icon,
  trailing,
  full = false,
  style,
  ...rest
}) => {
  const Cmp = VARIANTS[variant] || FilledButton;
  const iconName = icon || trailing;
  const mergedStyle = full ? { width: "100%", ...style } : style;
  return (
    <Cmp
      {...(trailing ? { trailingIcon: true } : null)}
      style={mergedStyle}
      {...rest}
    >
      {iconName && <Icon slot="icon" name={iconName} size={18} />}
      {children}
    </Cmp>
  );
};

export default Button;
