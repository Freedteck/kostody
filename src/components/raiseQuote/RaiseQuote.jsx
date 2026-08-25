import { useState } from "react";
import Sheet from "../../ui/Sheet";
import TextField from "../../ui/TextField";
import Select, { Option } from "../../ui/Select";
import Button from "../../ui/Button";
import styles from "./RaiseQuote.module.css";

const VALIDITY = [
  { value: "3", label: "3 Days" },
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
];

const RaiseQuote = ({ onClose, onSubmit, currentPrice }) => {
  const [price, setPrice] = useState("");
  const [validity, setValidity] = useState("7");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(price, validity);
  };

  return (
    <Sheet
      open
      onClose={onClose}
      title="Raise New Quote"
      subtitle="The customer must authorize the new price with their PIN."
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.previous}>
          <span className="md-typescale-body-medium">Previous price</span>
          <span className={`${styles.previousAmount} md-typescale-title-medium`}>
            ₦{(currentPrice || 0).toLocaleString()}
          </span>
        </div>

        <TextField
          className={styles.field}
          label="New quoted price"
          type="number"
          inputmode="numeric"
          prefixText="₦ "
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="30000"
          required
        />

        <Select
          className={styles.field}
          label="New quote validity"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          leadingIcon="event"
          required
        >
          {VALIDITY.map((v) => (
            <Option key={v.value} value={v.value}>
              {v.label}
            </Option>
          ))}
        </Select>

        <Button type="submit" variant="filled" full trailing="arrow_forward">
          Proceed
        </Button>
      </form>
    </Sheet>
  );
};

export default RaiseQuote;
