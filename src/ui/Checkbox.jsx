import { Checkbox as MdCheckbox } from "./md";

const Checkbox = ({ onChange, ...rest }) => (
  <MdCheckbox onChange={onChange} {...rest} />
);

export default Checkbox;
