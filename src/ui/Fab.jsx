import { Fab as MdFab, BrandedFab as MdBrandedFab } from "./md";
import Icon from "./Icon";

const Fab = ({
  icon,
  label,
  size = "medium",
  variant = "primary",
  lowered = false,
  branded = false,
  ...rest
}) => {
  const Cmp = branded ? MdBrandedFab : MdFab;
  return (
    <Cmp
      variant={variant}
      size={label ? undefined : size}
      label={label}
      {...(lowered ? { lowered: true } : null)}
      {...rest}
    >
      <Icon slot="icon" name={icon} />
    </Cmp>
  );
};

export default Fab;
