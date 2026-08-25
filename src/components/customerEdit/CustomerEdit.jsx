import { useState } from "react";
import { Sheet, TextField, Button } from "../../ui";
import { updateCustomerProfile } from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./CustomerEdit.module.css";

const CustomerEditSheet = ({ onClose, onSave, currentData, customerId }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(currentData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateCustomerProfile(customerId, formData)
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
    <Sheet open onClose={onClose} title="Edit profile" dismissible={!isSaving}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          label="Full name"
          name="name"
          type="text"
          value={formData.name || ""}
          onChange={handleChange}
          leadingIcon="person"
          required
          disabled={isSaving}
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={handleChange}
          leadingIcon="call"
          required
          disabled={isSaving}
        />
        <Button
          type="submit"
          variant="filled"
          full
          disabled={isSaving}
          className={styles.submit}
        >
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Sheet>
  );
};

export default CustomerEditSheet;
