import { useState } from "react";
import styles from "./RaiseQuote.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const RaiseQuote = ({ onClose, onSubmit, currentPrice }) => {
  const [price, setPrice] = useState("");
  const [validity, setValidity] = useState("7");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(price, validity);
  };

  return (
    <BottomSheet onClose={onClose} title="Raise New Quote">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="prevPrice">
            Previous Price (₦)
          </label>
          <input
            type="text"
            id="prevPrice"
            className={styles.input}
            value={currentPrice.toLocaleString()}
            disabled
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-secondary)",
            }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="newPrice">
            New Quoted Price (₦)
          </label>
          <input
            type="number"
            id="newPrice"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 30000"
            required
            autoFocus
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="newValidity">
            New Quote Validity
          </label>
          <select
            id="newValidity"
            className={styles.select}
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            required
          >
            <option value="3">3 Days</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Proceed
        </button>
      </form>
    </BottomSheet>
  );
};

export default RaiseQuote;
