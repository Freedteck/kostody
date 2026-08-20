import { useState } from "react";
import styles from "./CustomerEdit.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { updateCustomerProfile } from "../../services/api";
import useToast from "../../hooks/useToast";

const CustomerEditSheet = ({ onClose, onSave, currentData, customerId }) => {
  const [formData, setFormData] = useState(currentData);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    await updateCustomerProfile(customerId, formData)
      .then((updatedData) => {
        onSave(updatedData);
      })
      .catch((error) => {
        showToast(error.message || "Failed to update profile.", "error");
      })
      .finally(() => {
        setIsSaving(false);
      });
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
            disabled={isSaving}
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
            disabled={isSaving}
          />
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

export default CustomerEditSheet;
