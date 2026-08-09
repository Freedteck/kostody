import { useState } from "react";
import styles from "./EditProfile.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const EditProfile = ({ onClose, onSave, currentData }) => {
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
    <BottomSheet onClose={onClose} title="Edit Shop Profile">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="shopName">
            Shop / Business Name
          </label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            className={styles.input}
            value={formData.shopName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="engineerName">
            Lead Engineer Name
          </label>
          <input
            type="text"
            id="engineerName"
            name="engineerName"
            className={styles.input}
            value={formData.engineerName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="shopPhone">
            Contact Phone (WhatsApp)
          </label>
          <input
            type="tel"
            id="shopPhone"
            name="shopPhone"
            className={styles.input}
            value={formData.shopPhone || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="shopAddress">
            Shop Address / Area
          </label>
          <input
            type="text"
            id="shopAddress"
            name="shopAddress"
            className={styles.input}
            value={formData.shopAddress || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="specialty">
            Specialty
          </label>
          <select
            id="specialty"
            name="specialty"
            className={styles.select}
            value={formData.specialty || ""}
            onChange={handleChange}
            required
          >
            <option value="General Repairs">
              General Repairs (Hardware/Software)
            </option>
            <option value="Hardware / Microsoldering">
              Hardware / Microsoldering
            </option>
            <option value="Software / Flashing">Software / Flashing</option>
            <option value="Board Level Repairs">Board Level Repairs</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn}>
          Save Changes
        </button>
      </form>
    </BottomSheet>
  );
};

export default EditProfile;
