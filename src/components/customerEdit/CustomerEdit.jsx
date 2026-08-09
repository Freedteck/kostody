import { useState } from "react";
import styles from "./CustomerEdit.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const CustomerEditSheet = ({ onClose, onSave, currentData }) => {
  const [formData, setFormData] = useState(currentData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <BottomSheet onClose={onClose} title="Edit Profile">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name || ""}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            value={formData.phone || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Save Changes
        </button>
      </form>
    </BottomSheet>
  );
};

export default CustomerEditSheet;
