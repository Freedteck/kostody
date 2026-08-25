import { PlainIconButton, FilledIconButton, TonalIconButton } from "./md";
import Icon from "./Icon";

const VARIANTS = {
  standard: PlainIconButton,
  filled: FilledIconButton,
  tonal: TonalIconButton,
};

const IconButton = ({
  variant = "standard",
  icon,
  filledIcon,
  label,
  selected,
  toggle = false,
  size = 24,
  ...rest
}) => {
  const Cmp = VARIANTS[variant] || PlainIconButton;
  return (
    <Cmp
      aria-label={label}
      title={label}
      {...(toggle ? { toggle: true } : null)}
      {...(selected !== undefined ? { selected } : null)}
      {...rest}
    >
      <Icon name={icon} size={size} />
      {toggle && (
        <Icon slot="selected" name={filledIcon || icon} filled size={size} />
      )}
    </Cmp>
  );
};

export default IconButton;
