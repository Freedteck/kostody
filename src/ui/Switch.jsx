import { Switch as MdSwitch } from "./md";

const Switch = ({ onChange, ...rest }) => (
  <MdSwitch onChange={onChange} {...rest} />
);

export default Switch;
