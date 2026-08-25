import { forwardRef } from "react";
import TextField from "./TextField";

const TextArea = forwardRef(({ rows = 3, ...rest }, ref) => (
  <TextField ref={ref} type="textarea" rows={rows} {...rest} />
));

TextArea.displayName = "TextArea";

export default TextArea;
