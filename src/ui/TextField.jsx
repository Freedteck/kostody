import { forwardRef } from "react";
import { FilledTextField, OutlinedTextField } from "./md";
import Icon from "./Icon";

const TextField = forwardRef(
  (
    { variant = "outlined", onChange, leadingIcon, trailingIcon, children, ...rest },
    ref,
  ) => {
    const Cmp = variant === "filled" ? FilledTextField : OutlinedTextField;
    return (
      <Cmp ref={ref} onInput={onChange} {...rest}>
        {leadingIcon && <Icon slot="leading-icon" name={leadingIcon} />}
        {trailingIcon && <Icon slot="trailing-icon" name={trailingIcon} />}
        {children}
      </Cmp>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
