import { useState } from "react";
import styles from "./EditProfile.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

const EditProfile = ({ onClose, onSave, currentData, isSaving }) => {
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            Contact Phone (WhatsApp)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            value={formData.phone || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="address">
            Shop Address / Area
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={styles.input}
            value={formData.address || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
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
            disabled={isSaving}
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

        <button type="submit" className={styles.submitBtn} disabled={isSaving}>
          {isSaving ? (
            <>
              <span className={styles.spinner}></span> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </BottomSheet>
  );
};

export default EditProfile;
