import { forwardRef } from "react";
import { FilledSelect, OutlinedSelect, SelectOption } from "./md";
import Icon from "./Icon";

const Select = forwardRef(
  ({ variant = "outlined", onChange, leadingIcon, children, ...rest }, ref) => {
    const Cmp = variant === "filled" ? FilledSelect : OutlinedSelect;
    return (
      <Cmp ref={ref} onChange={onChange} {...rest}>
        {leadingIcon && <Icon slot="leading-icon" name={leadingIcon} />}
        {children}
      </Cmp>
    );
  },
);

Select.displayName = "Select";

export const Option = SelectOption;

export default Select;
